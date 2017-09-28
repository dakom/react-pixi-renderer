# Building

Library code is in [src/lib](src/lib). Packaging and bundling is all done with [FuseBox](http://fuse-box.org/)

The following list provides various development scenarios in more detail. In short, the recommended flow is:

1. `Dev` - quick iteration while seeing live changes in the browser. Once that's confirmed to work...
2. `Test` - unit tests to confirm that nothing else was broken in the process
3. `Build` - create the final build for distribution
4. `External` - integration test to confirm that the library loads externally, via the distribution build
5. Commit to repo / deploy to npm.

### Dev

```bash
$> npm run dev
```

Iterative developing in a browser environment. Changes to the source in either the library itself or the browser app code will be recompiled on save.

Note that it currently caches the html markup - dom changes should really be code-driven or be very minimal/static.

Project is in `src/dev` folder, code entry point is `src/dev/DevInit.ts`


### Test - unit

```bash
$> npm run test:unit
```

Runs unit tests against all *.test.ts files in src/tests directory

### Build

```bash
$> npm run build
```

Creates the distribution library (both minified and not), as well as the Typescript definition files. 

Deployments must have run this first so that the `dist` folder is up to date

### Test - external

```bash
$> npm run test:external
```

 Verifies the scenario of loading in the browser as an external library. This does not watch for changes to the library itself - it's only for final real-world testing against the final build. Therefore, you _must_ `build` before running this.

Project is in `src/tests/external-browser` folder.