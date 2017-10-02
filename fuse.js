/*
 * Imports
 */
const path = require('path');
const express = require('express');
const { EnvPlugin, FuseBox, QuantumPlugin, WebIndexPlugin } = require("fuse-box");

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
    DEV_PRODUCTION: "dev-production",
    PLAIN: "build-plain",
    PRODUCTION: "build-production",
    BROWSER_PRODUCTION: "build-browser-production",
    BROWSER_PLAIN: "build-browser-plain",
    TEST: "test-unit",
    
}

const buildType = process.env.BUILD_TYPE;
const devStaticRoot = "./src/dev/static";

//sanity check
if(Object.keys(BUILD).map(key => BUILD[key]).indexOf(buildType) === -1) {
    console.error(`unknown build type! [${buildType}]`);
    process.exit();
}
console.log(`----------- building [${buildType}] --------`);

/* Common props between all targets */
const outputType = buildType.replace("build-", "").replace("plain", "dev");

const commonFuseProps = {
    output: `dist/$name.${outputType}.js`,
    homeDir: "src",
    modulesFolder: "temp_modules",
    target: "browser",
    useTypescriptCompiler : true,
}

/* Setup NODE_ENV and pass it through */
const nodeEnv = 
    (buildType === BUILD.PRODUCTION || buildType === BUILD.DEV_PRODUCTION || buildType === BUILD.BROWSER_PRODUCTION)
        ? "production"
        : process.env.NODE_ENV;

process.env.NODE_ENV = nodeEnv;

const commonPlugins = [ EnvPlugin({ BUILD_TYPE: buildType, NODE_ENV: nodeEnv}) ]

/* Per-target props */

let fuseProps = (() => {
    switch(buildType) {
        case BUILD.PLAIN:
        case BUILD.BROWSER_PLAIN:
        case BUILD.DEV:
            return ({
                sourceMaps: { inline: false },
            })
        case BUILD.PRODUCTION:
        case BUILD.BROWSER_PRODUCTION:
        case BUILD.DEV_PRODUCTION:
            return ({
                plugins: [
                    QuantumPlugin({
                        removeUseStrict: false,
                        globalRequire: false,
                        containedAPI: true,
                        bakeApiIntoBundle: bundleName,
                        treeshake: true,
                        uglify: true,
                        target: (buildType === BUILD.BROWSER_PRODUCTION || buildType === BUILD.DEV_PRODUCTION) ? "browser" : "npm"
                    })
                ]
            })
        default:
            return ({});
    }
        
})();

if(buildType !== BUILD.TEST) {
    fuseProps.package = "react-pixi-renderer";
    fuseProps.globals = { "react-pixi-renderer": "ReactPixi" };
}

if(buildType === BUILD.DEV || buildType === BUILD.DEV_PRODUCTION) {
    const webPlugins = [
        WebIndexPlugin({
            title: devPageTitle,
            template: devStaticRoot + "/index.html",
            path: "."
        })
    ];
    fuseProps.plugins = fuseProps.plugins ? fuseProps.plugins.concat(webPlugins) : webPlugins;
}

//Mix it all in
fuseProps.plugins = fuseProps.plugins ? fuseProps.plugins.concat(commonPlugins) : commonPlugins;

fuseProps = Object.assign(commonFuseProps, fuseProps);

//create producer
const fuse = FuseBox.init(Object.assign(commonFuseProps, fuseProps));

//create bundle
const bundle = fuse.bundle(bundleName);

switch(buildType) {
    case BUILD.TEST:
        bundle.test("[tests/unit/**/**.test.ts]");
        break;
    case BUILD.DEV:
    case BUILD.DEV_PRODUCTION:
        bundle
            .instructions(`>dev/DevMain.tsx`)
            .watch()
            .hmr();
        fuse.dev({ open: true }, server => {
            const app = server.httpServer.app;
            app.use("/static/", express.static(devStaticRoot));
        });
        break;
    default:
        bundle.instructions(`>[lib/LibMain.ts]`);
        break;
}

//go!
fuse.run();