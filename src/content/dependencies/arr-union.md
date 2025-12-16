---
name: arr-union
description: Combines a list of arrays, returning a single array with unique values.
type: trivial
---

## About

This dependency combines a list of arrays, returning a single array with unique values.

This can be done concisely and natively by using the [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) object and the [`spread operator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

```js
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [5, 6, 7, 8, 9];
const arr3 = [9, 10, 11, 12, 13];

const result = [...new Set([...arr1, ...arr2, ...arr3])]; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, …]
```

As a function:

```js
function union(...arrays) {
    return [...new Set(arrays.flat())];
}

const arr1 = [1, 2, 3];
const arr2 = [3, 4, 5];
const arr3 = [5, 6, 7];

const result = union(arr1, arr2, arr3); // [1, 2, 3, 4, 5, 6, 7]
```
