---
name: repeating
description: Convoluted way to call String.prototype.repeat
type: obsolete-js
implementation: javascript.builtins.String.repeat
---

## About

This dependency reimplents the native [`String.prototype.repeat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) method. It is supported by all modern browsers and Node.js versions since about x years.

```js
// Repeat a string
const str = "foo";
console.log(str.repeat(3)); // "foofoofoo"
```
