---
name: repeating
description: Convoluted way to call `String.prototype.repeat()`
type: obsolete-js
implementation: javascript.builtins.String.repeat
---

## About

This dependency reimplements the native [`String.prototype.repeat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) method. It is supported by all modern browsers and Node.js versions since ES6 (2015).

```js
// Repeat a string
const str = "foo";
console.log(str.repeat(3)); // "foofoofoo"
```
