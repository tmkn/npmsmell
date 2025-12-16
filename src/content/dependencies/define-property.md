---
name: define-property
description: Reimplements the native Object.defineProperty() method.
type: obsolete-js
implementation: javascript.builtins.Object.defineProperty
---

## About

This dependency reimplements the native [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) method. It is supported by all modern browsers and Node.js versions since ES5 (2009).

```js
// Define a non-enumerable property on an object
const obj = {};
Object.defineProperty(obj, "foo", {
    value: "bar",
    enumerable: false
});

console.log(obj.foo); // "bar"
console.log(Object.keys(obj)); // []
```

Additionally, it needs multiple dependencies to do what `Object.defineProperty` can do natively.
