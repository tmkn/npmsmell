# [npmsmell.com](https://npmsmell.com)

![public/og.png](public/og.png)

```
npm run start
```

## About

[npmsmell.com](https://npmsmell.com) highlights trivial and outdated NPM packages to reduce the risk of supply chain attacks. With the goal that over time, listed packages end up being sunsetted.

### Info

The project is built with `Node.js` and uses [Astro](https://astro.build) and [TailwindCSS](https://tailwindcss.com/) and uses `npm` as package manger.

## Getting started

```
npm install
npm run start
```

The site will be available locally after the dev server starts.

## Contributing

Pull requests are welcome.

### Adding a new package

1. Add a new Markdown file for the package to [`src/content/dependencies`](./src/content/dependencies/) (use existing files for reference or see the [Package data](#package-data) section).

2. Run the metadata sync command.
    - ```
      npm run astro sync
      ```

    - This fetches npm metadata such as:
        - dependency tree
        - weekly download numbers
    - The generated data is stored in `metadata/packages/`

3. Commit both your content and generated metadata.

4. Open a pull request 🚀

### Package data

> [!WARNING]
> Note: Scoped packages are not currently supported.

Package data is stored in Markdown files under [`src/content/dependencies`](src/content/dependencies/).

Depending on the package type, different frontmatter is required. There are three package types:

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

The `implementation` string comes from the [MDN compatibility data](https://github.com/mdn/browser-compat-data). On the MDN page for the function, scroll to the bottom to find `View this page on GitHub` check the GitHub source and its frontmatter to find the corresponding implementation string.

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

### What is the criteria to add packages?

High usage with combined with low value, e.g.:

- Replicates native functionality, or
- Implements trivial logic, and
- Has 100,000+ weekly downloads

### How can I update the metadata?

Delete the existing metadata directory:

```
metadata/packages/
```

Then run:

```
npm run astro sync
```

This will recreate the metadata. Alternatively, you can delete only the specific metadata files you want to recreate and rerun the command.
