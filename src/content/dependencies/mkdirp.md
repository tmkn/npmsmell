---
name: make-dir
description: Creates a directory and all its parent directories automatically
type: obsolete-node
date: 2018-10-30
version: 10.12.0
---

Historically, Node.js’s `mkdir` function could only create a single directory at a time, which made creating nested directories cumbersome. To address this limitation, this package was created to simplify nested directory creation.

Today, Node.js widely supports the `recursive` option for `mkdir`, which makes this package obsolete.

```ts
fs.mkdir("data/uploads/images", { recursive: true }, err => {
    if (err) throw err;
    console.log("Directory created");
});
```
