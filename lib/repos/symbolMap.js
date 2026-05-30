import fs from "node:fs";
import path from "node:path";
import { db } from "../db.js";

const JS_TS_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const MAX_SYMBOL_FILE_SIZE = 512 * 1024; // 512 KB

const FLOW_KEYWORDS = new Set([
  "if", "else", "for", "while", "do", "switch", "case",
  "try", "catch", "finally", "return", "throw",
  "typeof", "instanceof", "in", "of", "break", "continue"
]);

const TYPE_COUNT_KEY = {
  import: "imports",
  export: "exports",
  function: "functions",
  class: "classes",
  method: "methods",
  constant: "constants",
  routeHandler: "routeHandlers",
  schema: "schemas"
};

function detectLanguage(ext) {
  return ext === ".ts" || ext === ".tsx" ? "typescript" : "javascript";
}

function extractImportName(line) {
  if (/^import\s+["']/.test(line)) {
    const m = line.match(/["']([^"']+)["']/);
    return m ? m[1] : "";
  }
  const star = line.match(/^import\s+\*\s+as\s+(\w+)/);
  if (star) return star[1];
  const def = line.match(/^import\s+(?:type\s+)?(\w+)\s+from/);
  if (def) return def[1];
  const named = line.match(/^import\s+(?:type\s+)?\{([^}]+)\}/);
  if (named) return named[1].split(",")[0].trim().split(" as ")[0].trim();
  const req = line.match(/(?:const|let|var)\s+\{?(\w+)/);
  return req ? req[1] : "";
}

function parseLine(lineNum, raw) {
  const t = raw.trim();
  if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return null;

  // 1. Import
  if (/^import\s/.test(t) || /^(?:const|let|var)\s+[\w{][\w\s{},]*\s*=\s*require\s*\(/.test(t)) {
    return { type: "import", name: extractImportName(t), line: lineNum, signature: t.slice(0, 80) };
  }

  // 2. Route handler (Express/Koa style)
  const rm = t.match(/(?:router|app)\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]*)/);
  if (rm) {
    return {
      type: "routeHandler",
      name: `${rm[1].toUpperCase()} ${rm[2]}`,
      line: lineNum,
      signature: t.slice(0, 80)
    };
  }

  // 3. Schema (Zod, Yup, Mongoose, custom)
  if (/(?:z\.(object|array)|yup\.object|new\s+Schema\s*\(|defineSchema\s*\()/.test(t)) {
    const am = t.match(/(?:const|let|var)\s+(\w+)\s*=/);
    return { type: "schema", name: am ? am[1] : "schema", line: lineNum, signature: t.slice(0, 80) };
  }

  // 4. Function declaration: function name(, async function name(
  const fd = t.match(/^(?:export\s+)?(?:async\s+)?function[\s*]+(\w+)\s*\(/);
  if (fd) return { type: "function", name: fd[1], line: lineNum, signature: t.slice(0, 80) };

  // 5. Arrow function or assigned function expression
  // Handles: const name = () => ..., const name = async () => ..., const name = function(
  const fa = t.match(/^(?:export\s+)?(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?(?:function\b|\([^)]*\)\s*(?::\s*\S+\s*)?=>)/);
  if (fa) return { type: "function", name: fa[1], line: lineNum, signature: t.slice(0, 80) };

  // 6. Class declaration
  const cl = t.match(/^(?:export\s+)?(?:default\s+)?class\s+(\w+)/);
  if (cl) return { type: "class", name: cl[1], line: lineNum, signature: t.slice(0, 80) };

  // 7. Method: requires leading indentation + name(params) {
  const mm = raw.match(/^(\s{2,})(?:async\s+)?(?:static\s+)?(?:get\s+|set\s+)?(\w+)\s*\([^)]*\)\s*\{/);
  if (mm && !FLOW_KEYWORDS.has(mm[2])) {
    return { type: "method", name: mm[2], line: lineNum, signature: t.slice(0, 80) };
  }

  // 8. Constant declaration (any const that was not matched above as function/class/schema)
  const cc = t.match(/^(?:export\s+)?const\s+(\w+)\s*=/);
  if (cc) return { type: "constant", name: cc[1], line: lineNum, signature: t.slice(0, 80) };

  // 9. Stand-alone export: export { ... }, export default <expr>, export * from
  if (/^export\s*\{/.test(t) || /^export\s+default\b/.test(t) || /^export\s+\*/.test(t)) {
    let name = "default";
    if (/^export\s*\{/.test(t)) {
      const nm = t.match(/\{([^}]+)\}/);
      name = nm ? nm[1].split(",")[0].trim().split(" as ")[0].trim() : "named";
    } else if (/^export\s+\*/.test(t)) {
      name = "*";
    }
    return { type: "export", name, line: lineNum, signature: t.slice(0, 80) };
  }

  return null;
}

export function symbolMap(row) {
  const files = db
    .prepare(
      "SELECT path, extension, size_bytes AS sizeBytes FROM repo_files WHERE repo_id = ? ORDER BY path"
    )
    .all(row.id);

  const jsFiles = files.filter((f) => JS_TS_EXTENSIONS.has(f.extension));

  const counts = {
    imports: 0,
    exports: 0,
    functions: 0,
    classes: 0,
    methods: 0,
    constants: 0,
    routeHandlers: 0,
    schemas: 0
  };

  const resultFiles = [];

  for (const file of jsFiles) {
    if (file.sizeBytes > MAX_SYMBOL_FILE_SIZE) continue;

    const filePath = path.join(row.root_path, file.path);
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }

    const lines = content.split(/\r?\n/);
    const symbols = [];

    for (let i = 0; i < lines.length; i++) {
      const sym = parseLine(i + 1, lines[i]);
      if (sym) {
        symbols.push(sym);
        const key = TYPE_COUNT_KEY[sym.type];
        if (key) counts[key]++;
      }
    }

    if (symbols.length) {
      resultFiles.push({
        path: file.path,
        language: detectLanguage(file.extension),
        symbols
      });
    }
  }

  return {
    repo: { id: row.id, name: row.name },
    summary: {
      totalFilesScanned: jsFiles.length,
      totalSymbols: Object.values(counts).reduce((a, b) => a + b, 0),
      counts
    },
    files: resultFiles
  };
}
