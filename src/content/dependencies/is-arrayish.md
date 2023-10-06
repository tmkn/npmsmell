---
name: is-arrayish
description: Checks if a value is an array.
type: obsolete-js
implementation: javascript.builtins.Array.isArray
---

## About

This dependency checks if you're dealing with an array.

To check for an array, you can use the native `Array.isArray` method:

`Array.isArray` is part of the ECMAScript standard and is widely supported in modern browsers and Node.js.

```js
Array.isArray([]); // true

Array.isArray({}); // false
Array.isArray(null); // false
Array.isArray(undefined); // false
Array.isArray(123); // false
// etc.
```

No need to use a dependency to check if you're dealing with an array.
