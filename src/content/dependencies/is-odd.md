---
name: is-odd
description: Checks if a number is odd.
type: trivial
---

## About

This dependency checks if a number is odd.

This can be done natively with the [`%` remainder](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder) operator. It returns the remainder leftover.

```js
1 % 2; // 1
2 % 2; // 0
3 % 2; // 1
4 % 2; // 0
// ...
```

Odd numbers return `1`, so a corresponding function would look like:

```js
function isEven(number) {
    return number % 2 !== 0;
}

isEven(3); // true
isEven(6); // false
```
