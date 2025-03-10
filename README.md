
# Project Installation Guide

## Requirements
Before starting, ensure you have installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [npm](https://www.npmjs.com/) (Included with Node.js)

## Installing Dependencies
To install all project dependencies, run the following command:

```sh
npm install --legacy-peer-deps
```

### 🔍 Why Use `--legacy-peer-deps`?
This flag allows you to bypass dependency conflicts, especially useful for older projects or when encountering the error `ERESOLVE unable to resolve dependency tree` in npm.

## Running the Project
After successful installation, you can start the project with:

```sh
npm start
```

Or if the project requires a build step, use:

```sh
npm run build
```

## Common Issues & Fixes
### 1. `npm install` fails with `ERESOLVE unable to resolve dependency tree`
➡ **Solution**: Use `npm install --legacy-peer-deps`

### 2. Still encountering installation errors?
➡ **Solution**: Try running:

```sh
npm install --force
```

## Contact
If you encounter issues while installing or running the project, feel free to reach out via email or open an issue on GitHub! 🚀

## License

MIT


