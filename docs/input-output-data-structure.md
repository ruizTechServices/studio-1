# Repo Map Input / Output Data Structure

## Purpose

The Repo Map takes a repository as input and returns an organized structure of the project.

The scanner should understand the repo before any modification tools are added.

## Input

Current implementation accepts a GitHub repo URL and scans the cloned/default repo state. Branch/commit pinning is planned but not part of the current MVP implementation.

```json
{
  "repo": {
    "sourceType": "github_url",
    "url": "https://github.com/example/example-repo",
    "branch": null,
    "commit": null
  },
  "scanOptions": {
    "includeDocs": true,
    "includeTests": true,
    "includeConfig": true,
    "ignorePatterns": [
      "node_modules",
      ".git",
      "dist",
      "build",
      ".next",
      "coverage"
    ]
  }
}
```

## Input Fields

| Field | Type | Required | Description |
|---|---:|---:|---|
| `repo.sourceType` | string | yes | Where the repo comes from. Initial value: `github_url`. |
| `repo.url` | string | yes | GitHub repository URL. |
| `repo.branch` | string/null | no | **Future / planned.** Branch pinning is not accepted by the current import endpoint. |
| `repo.commit` | string/null | no | **Future / planned.** Commit pinning is not accepted by the current import endpoint. |
| `scanOptions.includeDocs` | boolean | no | Include documentation files in the map. |
| `scanOptions.includeTests` | boolean | no | Include test files in the map. |
| `scanOptions.includeConfig` | boolean | no | Include config files in the map. |
| `scanOptions.ignorePatterns` | string[] | no | Folders or file patterns to skip. |

## Output

The output shape below remains useful as a target data contract. `repo.branch` and `repo.commit` are planned metadata and are not currently populated by the importer.

```json
{
  "repo": {
    "name": "example-repo",
    "url": "https://github.com/example/example-repo",
    "branch": null,
    "commit": null,
    "detectedStack": ["react", "vite", "typescript"]
  },
  "summary": {
    "totalFiles": 124,
    "scannedFiles": 96,
    "ignoredFiles": 28,
    "primaryLanguage": "typescript"
  },
  "projectMap": {
    "components": [],
    "pagesRoutes": [],
    "apiEndpoints": [],
    "functions": [],
    "classes": [],
    "databaseFiles": [],
    "authLogic": [],
    "paymentLogic": [],
    "aiLogic": [],
    "configFiles": [],
    "documentation": [],
    "tests": [],
    "problemsTodos": []
  },
  "files": [],
  "errors": []
}
```

## Mapped Item Shape

Each item inside `projectMap` should use this shape:

```json
{
  "id": "src-components-button-tsx",
  "name": "Button",
  "type": "component",
  "path": "src/components/Button.tsx",
  "language": "typescript",
  "exports": ["Button"],
  "imports": ["react"],
  "dependsOn": [],
  "description": "Reusable button component.",
  "confidence": 0.92
}
```

## File Item Shape

Each item inside `files` should use this shape:

```json
{
  "path": "src/components/Button.tsx",
  "name": "Button.tsx",
  "extension": ".tsx",
  "language": "typescript",
  "sizeBytes": 2048,
  "category": "components",
  "scanned": true,
  "ignoredReason": null
}
```

## Error Shape

```json
{
  "code": "SCAN_FAILED",
  "message": "Could not scan file.",
  "path": "src/example.ts",
  "recoverable": true
}
```

## First Version Rules

- The Repo Map should classify files before trying to summarize them.
- The scanner should ignore generated folders and dependency folders.
- The output should preserve file paths exactly as they exist in the repo.
- Every mapped item should point back to a real file path.
- Unknown files should stay in `files` even if they do not fit a project map category.
