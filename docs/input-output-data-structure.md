# Repo Map Input / Output Data Structure

## Purpose

The Repo Map takes a repository as input and returns an organized structure of the project.

The scanner should understand the repo before any modification tools are added.

## Input

```json
{
  "repo": {
    "sourceType": "github_url",
    "url": "https://github.com/example/example-repo",
    "branch": "main",
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
| `repo.branch` | string | no | Branch to scan. Defaults to the repo default branch. |
| `repo.commit` | string/null | no | Specific commit to scan. If null, scan the selected branch head. |
| `scanOptions.includeDocs` | boolean | no | Include documentation files in the map. |
| `scanOptions.includeTests` | boolean | no | Include test files in the map. |
| `scanOptions.includeConfig` | boolean | no | Include config files in the map. |
| `scanOptions.ignorePatterns` | string[] | no | Folders or file patterns to skip. |

## Output

```json
{
  "repo": {
    "name": "example-repo",
    "url": "https://github.com/example/example-repo",
    "branch": "main",
    "commit": "abc123",
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
