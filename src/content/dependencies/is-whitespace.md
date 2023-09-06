---
name: is-whitespace
type: obsolete-js
implementation: javascript.builtins.String.trim
---

## About

This dependency checks if a given string only contains whitespace characters.
This can be done natively with the [`String.prototype.trim`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim) method.

### Usage

```js
"  ".trim().length === 0; // true
"\n\t".trim().length === 0; // true
"\r\n".trim().length === 0; // true
"\t".trim().length === 0; // true
"foo".trim().length === 0; // false
```

or in a function:

```js
function isWhitespace(str) {
    return str.trim().length === 0;
}

isWhitespace("  "); // true
isWhitespace("\n\t"); // true
isWhitespace("\r\n"); // true
isWhitespace("\t"); // true
isWhitespace("foo"); // false
```
