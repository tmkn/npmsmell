---
name: path-type
description: Utility functions to check if a path is a file, directory, or symlink
type: obsolete-node
date: 2018-05-24
version: 10.0.0
---

This library provides utility functions to check if a path is a file, directory, or symlink. It provides sync and async versions. e.g.:

```typescript
import { isFile } from "path-type";

console.log(await isFile("package.json"));
//=> true
```

Node.js can do this natively via `lstat`:

```typescript
import fs from "node:fs";
const stats = fs.lstatSync(filePath);

if (stats.isFile()) {
    // path is a file
}
if (stats.isDirectory()) {
    // path is a directory
}
if (stats.isSymbolicLink()) {
    // path is a symlink
}
```

or asynchronously:

```typescript
import fs from "node:fs";
const stats = fs.lstatSync(filePath);

if (stats.isFile()) {
    // path is a file
}
if (stats.isDirectory()) {
    // path is a directory
}
if (stats.isSymbolicLink()) {
    // path is a symlink
}
```
