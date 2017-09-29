/*
 * Imports
 */
const path = require('path');
const express = require('express');
const { FuseBox, QuantumPlugin, WebIndexPlugin } = require("fuse-box");

/*
 * Config
 */

const bundleName = "react-pixi-renderer";
const devPageTitle = "React Pixi Renderer";


/*
 * No need to adjust anything below this line
 */

const BUILD = {
    DEV: "dev",
    DEV_PRODUCTION: "dev:production",
    PLAIN: "build:plain",
    PRODUCTION: "build:production",
    TEST: "test-unit",
    
}

const buildType = process.env.BUILD_TYPE;
const devStaticRoot = "./src/dev/static";
const sourceMapStyle = { inline: false };

//sanity check
if(Object.keys(BUILD).map(key => BUILD[key]).indexOf(buildType) === -1) {
    console.error(`unknown build type! [${buildType}]`);
    process.exit();
}
console.log(`----------- building [${buildType}] --------`);

const isProduction = (buildType === BUILD.PRODUCTION || buildType === BUILD.DEV_PRODUCTION)
if(isProduction) {
    process.env.NODE_ENV = "production";
}

//create producer
const fuse = FuseBox.init({
    homeDir: "src",
    modulesFolder: "temp_modules",
    output: (buildType !== BUILD.PRODUCTION) ? `dist/$name.js` : `dist/$name.min.js`,
    target: "browser",
    useTypescriptCompiler : true,
    package: (buildType === BUILD.TEST) ? undefined : "react-pixi-renderer",
    
    globals: (buildType === BUILD.TEST) ? undefined : { "react-pixi-renderer": "ReactPixi" },
    
    sourceMaps: (isProduction) ? undefined : sourceMapStyle,
    plugins: [
        isProduction
        && QuantumPlugin({
            removeUseStrict: false, //this magically fixed some weird quirks with react running before DOM mounting
            containedAPI: true,
            bakeApiIntoBundle: bundleName,
            treeshake: true,
            uglify: true,
            target: (buildType === BUILD.DEV_PRODUCTION) ? "browser" : "npm"
        }),

        (buildType === BUILD.DEV || buildType === BUILD.DEV_PRODUCTION)
        && WebIndexPlugin({
            title: devPageTitle,
            template: devStaticRoot + "/index.html",
            path: "."
        })
    ]
});

//create bundle
const bundle = fuse.bundle(bundleName);

if (buildType !== BUILD.TEST) {
    switch(buildType) {
        case BUILD.DEV:
        case BUILD.DEV_PRODUCTION:
            bundle.instructions(`>dev/DevMain.tsx`);
            break;
        default:
            bundle.instructions(`>lib/LibMain.ts`);
            break;
    }
} else {
    bundle.test("[tests/unit/**/**.test.ts]");
}

//setup dev server
if (buildType === BUILD.DEV || buildType === BUILD.DEV_PRODUCTION) {
    bundle
      .watch()
      .hmr();
    fuse.dev({ open: true }, server => {
        const app = server.httpServer.app;
        app.use("/static/", express.static(devStaticRoot));
    });
}

//go!
fuse.run();