---
name: array-filter
description: Reimplements the native Array.prototype.filter() method.
type: obsolete-js
implementation: javascript.builtins.Array.filter
---

## About

This dependency reimplents the native [`Array.prototype.filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method. It is supported by all modern browsers and Node.js versions since about 11 years.

The `Array.prototype.filter()` method creates a new array with all elements that pass the test implemented by the provided function.

```js
// Show all elements that are greater than 10
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const filtered = arr.filter(element => element > 10);
console.log(filtered); // []
```
