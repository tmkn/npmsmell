---
name: lower-case
description: Converts a string to lower case.
type: obsolete-js
implementation: javascript.builtins.String.toLowerCase
---

## About

This dependency reimplements the native [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase) method. It is supported by all modern browsers and Node.js versions since the beginning of JavaScript.

```js
// Convert a string to lower case
const str = "FOO";
console.log(str.toLowerCase()); // "foo"
```

Use [`String.prototype.toLocaleLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase) instead if you need to support non-English languages.

```js
const dotted = "İstanbul";

console.log(`EN-US: ${dotted.toLocaleLowerCase("en-US")}`); // "i̇stanbul"
console.log(`TR: ${dotted.toLocaleLowerCase("tr")}`); // "istanbul"
```
