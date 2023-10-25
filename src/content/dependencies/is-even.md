---
name: is-even
description: Checks if a number is even.
type: trivial
---

## About

This dependency checks if a number is even.

This can be done natively with the [`%` remainder](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder) operator. It returns the remainder leftover.

```js
1 % 2; // 1
2 % 2; // 0
3 % 2; // 1
4 % 2; // 0
// ...
```

Even numbers return `0`, so a corresponding function would look like:

```js
function isEven(number) {
    return number % 2 === 0;
}

isEven(4); // true
isEven(7); // false
```
