---
name: array-unique
description: Filters duplicate values from an array.
type: trivial
implementation: javascript.builtins.Set
---

## About

This dependency filters duplicate values from an array.

This can be done natively using the [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) object and the [`spread operator``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

```js
const arr1 = [1, 2, 3, 4, 5, 5, 5];
const unique1 = [...new Set(arr)]; // [1, 2, 3, 4, 5]

const arr2 = ["a", "b", "c", "c", "d", "d", "d"];
const unique1 = [...new Set(arr)]; // ["a", "b", "c", "d"]
```

As function:

```js
function unique(arr) {
    return [...new Set(arr)];
}
```

Without the `spread operator`:

```js
function unique(arr) {
    return Array.from(new Set(arr));
}
```

Without the `spread operator` and `Set` object:

```js
function unique(arr) {
    return arr.filter((value, index, self) => self.indexOf(value) === index);
}
```

The `Set` object and `spread operator` are supported by all modern browsers and Node.js versions since about 7 years.
