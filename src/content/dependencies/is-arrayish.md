---
name: is-arrayish
type: obsolete-js
implementation: javascript.builtins.Array.isArray
---

To check if an object can be used as an array, you can use the native `Array.isArray` method:

`Array.isArray` is part of the ECMAScript standard and is widely supported in modern browsers and Node.js.

```js
Array.isArray([]); // true

Array.isArray({}); // false
Array.isArray(null); // false
Array.isArray(undefined); // false
Array.isArray(123); // false
// etc.
```

No need to use a dependency to check if an object can be used as an array.
