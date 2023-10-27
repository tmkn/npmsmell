# [npmsmell.com](https://npmsmell.com)

![public/og.png](public/og.png)

```
npm run start
```

## About

[npmsmell.com](https://npmsmell.com) keeps track of trivial and outdated NPM packages to lessen the impact of supply chain attacks. Ideally, the packages listed on the page should be sunsetted over time.

## Contributing

PR's welcome.

### Info

This is a `Node.js` project.

It is using [Astro](https://astro.build) and [TailwindCSS](https://tailwindcss.com/).

### Package data

The data for the packages are stored in markdow files, which are located in [`src/content/dependencies`](src/content/dependencies/).

Dependending on the type of the package, different frontmatter is required. There are 3 types of packages:

> Note: It currently doesn't support scoped packages.

#### `trivial`

Use this type for packages that implement trivial functionality like checking if numbers are even or odd.

```typescript title="Frontmatter"
// frontmatter format
interface {
    name: string;           // The name of the package
    description: string;    // A short description of the package
    type: 'trivial';
}
```

#### `obsolete-js`

Use this type for packages that implement native JS functionality.

```typescript title="Frontmatter"
// frontmatter format
interface {
    name: string;           // The name of the package
    description: string;    // A short description of the package
    type: 'obsolete-js';
    implementation: string; // The name of the JavaScript function that implements the functionality
}
```

The `implementation` string comes from the MDN compatibiliy data. Go to the MDN page of the function, look at its Github source and in its frontmatter you will find the corresponding `implementation` string ot use.

The `implementation` string value is used to to calculate the browser support.

#### `obsolete-node`

Use this type for packages that implement functionality that is already available in Node.js.

```typescript title="Frontmatter"
// frontmatter format
interface {
    name: string;           // The name of the package
    description: string;    // A short description of the package
    type: 'obsolete-node';
    version: string;        // The version of Node.js that implements the functionality
}
```

## FAQ

### Should any trivial or outdated package be added?

Generally not, the goal is to minimize the impact of supply chain attacks. So packages with high weekly download numbers are prioritized (for now). If the download count is above 100 000 downloads per week, the package should be added.
