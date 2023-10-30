---
name: define-properties
description: Convoluted way of calling Object.defineProperties.
type: obsolete-js
implementation: javascript.builtins.Object.defineProperties
---

## About

This dependency lets you set multiple non enumerated properties on an object at once. This can be done natively with the [`Object.defineProperties`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) method.

It's supported by all modern browsers and Node.js versions since about 6 years.

### Example

```js
// unless specified, added properties are non enumerable by default
Object.defineProperties(obj, {
    foo: { value: "bar" },
    baz: { value: "qux" }
});

Object.keys(obj); // []
```

While this dependency takes a 3rd argument to determine whether to overwrite existing properties, this functionality is very trivial to add yourself.

Not to mention this dependency comes with dependencies of its own, which makes it a very heavy dependency for such a trivial task.
