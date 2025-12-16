---
name: arr-diff
description: Returns the difference between the first array and additional arrays.
type: trivial
implementation: javascript.builtins.Array.filter
---

## About

This dependency returns an array with only the unique values from the first array, by excluding all values from additional arrays.

This can be done natively using the [`Array.prototype.filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) and [`Array.prototype.includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) methods.

```js
const arr1 = ['a', 'b', 'c'];
const arr2 = ['b', 'c', 'e'];

const diff = arr1.filter(x => !arr2.includes(x)); // ['a']
```

As a function:

```js
function diff(arr, ...args) {
    const exclude = new Set(args.flat());
    return arr.filter(x => !exclude.has(x));
}
```
