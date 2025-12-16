---
name: upper-case
description: Converts a string to upper case.
type: obsolete-js
implementation: javascript.builtins.String.toUpperCase
---

## About

This dependency reimplements the native [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase) method. It is supported by all modern browsers and Node.js versions since the beginning of JavaScript.

```js
// Convert a string to upper case
const str = "foo";

console.log(str.toUpperCase()); // "FOO"
```

Use [`String.prototype.toLocaleUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase) instead if you need to support non-English languages.

```js
const dotted = "istanbul";

console.log(city.toLocaleUpperCase("en-US")); // "ISTANBUL"
console.log(city.toLocaleUpperCase("TR")); // "İSTANBUL"
```
