---
name: isarray
description: Checks if a value is an array.
type: obsolete-js
implementation: javascript.builtins.Array.isArray
---

## About

This dependency checks if you're dealing with an array.

To check if you're dealing with an array, you can use the `Array.isArray` method:

`Array.isArray` is part of the ECMAScript standard and is widely supported in modern browsers and Node.js.

```js
Array.isArray([]); // true

Array.isArray({}); // false
Array.isArray(null); // false
Array.isArray(undefined); // false
Array.isArray(123); // false
// etc.
```

Another way to check if a value is an array, is to use the `instanceof` operator, also widely supported:

```js
[] instanceof Array; // true

({}) instanceof Array; // false
"foo" instanceof Array; // false
123 instanceof Array; // false
true instanceof Array; // false
// etc.
```

No need to use a dependency for this.
