---
name: is-core-module
description: Checks if a specifier is a core Node.js module
type: obsolete-node
date: 2012-03-15
version: 0.6.13
---

Only use this package if you want to check against a specific Node.js version.

If you just want to check if a module is a core module in the current Node.js version, you can use `module.builtinModules`:

```typescript
import { builtinModules } from "node:module";

console.log(builtinModules.includes("fs"));
//=> true
console.log(builtinModules.includes("express"));
//=> false
```
