---
name: is-string
description: Checks if a value is a string.
type: trivial
---

## About

This dependency checks if a given value is a `string`.

This can be done natively using the `typeof` operator in JavaScript:

### `typeof` operator

```js
typeof "foo" === "string"; // true
```

That's all you need to check if a value is a string in JavaScript.

```js
typeof 123 === "string"; // false
typeof {} === "string"; // false
typeof [] === "string"; // false
typeof null === "string"; // false
typeof undefined === "string"; // false
typeof true === "string"; // false
```

The `typeof` operator covers about 99% of string checks.

### `instanceof` operator

In the unlikely event that you have to deal with `String` objects, you can use the `instanceof` operator:

```js
new String("foo") instanceof String; // true
new Object("foo") instanceof String; // true
```

```js
new Boolean("foo") instanceof String; // false
new Number("foo") instanceof String; // false
new Date("foo") instanceof String; // false
new RegExp("foo") instanceof String; // false
new Error("foo") instanceof String; // false
new Function("foo") instanceof String; // false
new Array("foo") instanceof String; // false
// etc.
```

But really, you should not use `String` objects.

And that's how you check for a string in JavaScript. No dependencies needed.
