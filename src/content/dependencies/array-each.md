---
name: array-each
description: Reimplements the native Array.prototype.forEach() method.
type: obsolete-js
implementation: javascript.builtins.Array.forEach
---

## About

This dependency reimplements the native [`Array.prototype.forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) method. It is supported by all modern browsers and Node.js versions since ES5 (2009).

```js
// Loop over all elements in an array
const arr = [1, 2, 3, 4, 5];
arr.forEach(element => console.log(element));
// 1
// 2
// 3
// 4
// 5
```
