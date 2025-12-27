---
name: is-absolute
description: A convoluted way to call `path.isAbsolute()`
type: obsolete-node
date: 2013-05-13
version: 0.11.2
---

## About

Checks if a path is absolute.

To check if a path is absolute, you can use the builtin Node.js method [`path.isAbsolute`](https://nodejs.org/api/path.html#path_path_isabsolute_path):

```js
const path = require("path");

path.isAbsolute("/foo/bar"); // true
path.isAbsolute("foo/bar"); // false
path.isAbsolute("C:\\foo\\bar"); // true
path.isAbsolute("C:/foo/bar"); // true
path.isAbsolute("C:\\"); // true
path.isAbsolute("C:"); // false
path.isAbsolute("."); // false
path.isAbsolute(".."); // false
```
