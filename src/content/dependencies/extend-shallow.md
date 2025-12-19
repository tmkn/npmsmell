---
name: extend-shallow
type: obsolete-js
description: Reimplements the native Object.assign() method.
#implementation: javascript.operators.spread
implementation: javascript.builtins.Object.assign
---

## About

This dependency reimplements the [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method which is used to shallowly copy properties from one or more source objects to a target object.

It also needs 4 dependencies to do what `Object.assign` can do natively.

```js
// merge 2 objects
const obj1 = {
    foo: "bar"
};

const obj2 = {
    baz: "qux"
};

const merged = Object.assign({}, obj1, obj2);

console.log(merged); // { foo: "bar", baz: "qux" }
```

or you can use the [`spread`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) operator for a more concise syntax:

```js
// merge 2 objects
const obj1 = {
    foo: "bar"
};

const obj2 = {
    baz: "qux"
};

const merged = {
    ...obj1,
    ...obj2
};

console.log(merged); // { foo: "bar", baz: "qux" }
```

The `spread` operator is supported by all modern browsers and Node.js versions since ES2018.
`Object.assign` is supported since ES6 (2015).
