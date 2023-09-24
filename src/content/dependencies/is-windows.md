---
name: is-windows
type: trivial
---

## About

This dependency checks if the code is being run on Windows.

Node.js provides the [`process.platform`](https://nodejs.org/api/process.html#process_process_platform) property which returns the platform on which the Node.js process is running.

### Code

```js
process.platform === "win32"; // true

// as a function
function isWindows() {
    return process.platform === "win32";
}
```

that's all the dependency does.

Check [`process.platform`](https://nodejs.org/api/process.html#process_process_platform) for more information and for more platform values.
