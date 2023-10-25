---
name: for-in
type: obsolete-js
description: Recreates the behavior of the native for...in statement.
implementation: javascript.statements.for_in
---

## About

This dependency reimplements the `for...in` statement which is used to iterate over objects.

In fact, it even uses the `for...in` statement for its re-implemention, this is the whole [source code](https://github.com/jonschlinkert/for-in/blob/master/index.js):

```js
/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

"use strict";

module.exports = function forIn(obj, fn, thisArg) {
    for (var key in obj) {
        if (fn.call(thisArg, obj[key], key, obj) === false) {
            break;
        }
    }
};
```

### `for...in` usage

`for...in` is part of the ECMAScript standard and is widely supported in modern browsers and Node.js.

```js
const obj = {
    foo: "bar",
    baz: "qux"
};

const keys = [];
const values = [];

for (const key in obj) {
    keys.push(key);
    values.push(obj[key]);
}

console.log(keys); // ["foo", "baz"]
console.log(values); // ["bar", "qux"]
```

To replicate the early exit behavior of the `for...in` statement, you can use the `break` statement:

```js
const obj = {
    foo: "bar",
    baz: "qux"
};

const keys = [];
const values = [];

for (const key in obj) {
    // early exit
    if (key === "baz") {
        break;
    }

    keys.push(key);
    values.push(obj[key]);
}

console.log(keys); // ["foo"]
console.log(values); // ["bar"]
```

However `for...in` has some caveats, see [this article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in#Caveats) for more information.

You are more likely to want to use `for...of` instead, see [this article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) for more information.
