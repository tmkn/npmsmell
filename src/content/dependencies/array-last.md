---
name: array-last
description: Returns the last element of an array.
type: trivial
---

This dependency returns the last element of an array. It also pulls in {{dependencies}} additional dependency.

```typescript
var last = require("array-last");

last(["a", "b", "c", "d", "e", "f"]);
//=> 'f'
last(["a", "b", "c", "d", "e", "f"], 1);
//=> 'f'
last(["a", "b", "c", "d", "e", "f"], 3);
//=> ['d', 'e', 'f']
```

All these use cases can be easily done natively in JavaScript.

## Getting the last element

```typescript
const array = [1, 2, 3];
const lastElement = array[array.length - 1]; // 3
```

or if you are using ES2022 or later, you can use the `at` method:

```typescript
const array = [1, 2, 3];
const lastElement = array.at(-1); // 3
```

## Getting the last N elements

You can use the `slice` method to get the last N elements of an array:

```typescript
const array = [1, 2, 3, 4, 5];
const last3Elements = array.slice(-3); // [3, 4, 5]
```
