---
name: object-assign
description: Outdated `Object.assign` polyfill
type: obsolete-js
implementation: javascript.builtins.Object.assign
---

This library was used as an `Object.assign` polyfill for environments that did not support `Object.assign` natively.

However all modern JavaScript environments, including Node.js (since version 0.12) and all major browsers have been supporting `Object.assign` natively for many years now, making this polyfill unnecessary.
