---
name: array-slice
description: Reimplements the native `Array.prototype.slice()` method.
type: obsolete-js
implementation: javascript.builtins.Array.slice
---

## About

This dependency reimplements the native [`Array.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) method. It is supported by all modern browsers and Node.js versions since the beginning of JavaScript (ES3).

```js
// Get a subarray of an array
const arr = ["a", "b", "c", "d", "e"];
const subarr = arr.slice(1, 3);
// ["b", "c"]
```
