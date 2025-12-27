---
name: get-func-name
description: A convoluted way to access the `.name` property of a function.
type: obsolete-js
implementation: javascript.builtins.Function.name
---

## About

This dependency returns the name of a function.

You can get the name of a function by simply accessing the `name` property.

It is natively supported in JavaScript since ES6 (2015).

### Code

```js
function f1() {}
f1.name; // "f1"
```

### As a function

```js
// returns name of the function or undefined if func is not a function
function getFuncName(func) {
    return func?.name;
}
```

### More examples

```js
const f2 = () => {};
f2.name; // "f2"

const f3 = function () {};
f3.name; // "f3"

const f4 = function f4() {};
f4.name; // "f4"

const f5 = new Function();
f5.name; // "anonymous"

class Foo {
    static f6 = () => {};
}
Foo.f6.name; // "f6"

class Bar {
    f7() {}
}
new Bar().f7.name; // "f7"

// even works with bound functions
const f8 = f1.bind({});
f8.name; // "bound f1"

// etc.
```
