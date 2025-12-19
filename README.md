# [npmsmell.com](https://npmsmell.com)

![public/og.png](public/og.png)

```
npm run start
```

## About

[npmsmell.com](https://npmsmell.com) tracks trivial and outdated NPM packages to reduce the risk of supply chain attacks. Over time, listed packages should ideally be sunsetted.

## Contributing

Pull requests are welcome.

### Info

The project is built with `Node.js` and uses [Astro](https://astro.build) and [TailwindCSS](https://tailwindcss.com/).

### Package data

Package data is stored in Markdown files under [`src/content/dependencies`](src/content/dependencies/).

Depending on the package type, different frontmatter is required. There are three package types:

> Note: Scoped packages are not currently supported.

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

Use this type for packages that implement functionality now natively available in JavaScript (browser or runtime).

```typescript title="Frontmatter"
// frontmatter format
interface {
    name: string;           // The name of the package
    description: string;    // A short description of the package
    type: 'obsolete-js';
    implementation: string; // The name of the JavaScript function that implements the functionality
}
```

The implementation string comes from MDN compatibility data. On the MDN page for the function, check the GitHub source and its frontmatter to find the corresponding implementation string.

This string is used to calculate browser support.

#### `obsolete-node`

Use this type for packages that implement functionality already available in `Node.js`.

```typescript title="Frontmatter"
// frontmatter format
interface {
    name: string;           // The name of the package
    description: string;    // A short description of the package
    type: 'obsolete-node';
    version: string;        // The version of Node.js that implements the functionality
}
```

#### Placeholders

You can also include placeholders in your Markdown content to display dynamic NPM data. The following placeholders are supported:

- `{{downloads}}` — replaced with the package's weekly download count
- `{{dependencies}}` — replaced with the total number of dependencies
- `{{distinct_dependencies}}` — replaced with the number of distinct dependencies

## FAQ

### Should any trivial or outdated package be added?

Generally not, the goal is to reduce the risk of supply chain attacks. Packages with high weekly download numbers are prioritized. If a package has over 100,000 weekly downloads, it is a good candidate for inclusion.
