---
name: arr-flatten
description: Recursively flattens an array.
type: obsolete-js
implementation: javascript.builtins.Array.flat
---

This dependency recursively flattens an array:

```typescript
var flatten = require("arr-flatten");
flatten([1, [2, [3, [4]], 5], 6]);
//=> [1, 2, 3, 4, 5, 6]
```

You can achieve the same functionality natively in JavaScript using the `flat` method with `Infinity` as the depth argument:

```typescript
const array = [1, [2, [3, [4]], 5], 6];
const flattened = array.flat(Infinity); // [1, 2, 3, 4, 5, 6]
```

This is supported in all modern JavaScript environments
