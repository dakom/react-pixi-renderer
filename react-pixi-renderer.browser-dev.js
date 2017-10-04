(function(FuseBox){FuseBox.$fuse$=FuseBox;
var __process_env__ = {"BUILD_TYPE":"build-browser-plain"};
FuseBox.pkg("react-pixi-renderer", {}, function(___scope___){
___scope___.file("lib/LibMain.js", function(exports, require, module, __filename, __dirname){

"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Renderer_1 = require("./renderer/Renderer");
__export(require("./components/components"));
exports.ReactPixi = (function () {
    var container;
    return {
        render: function (element, pixiContainer, paintScreen) {
            if (!container) {
                container = Renderer_1.Renderer.createContainer(pixiContainer);
            }
            /*const doUpdate = () => {
                
            }
*/
            //Kindof just assigning randomly to one of these for now
            //See https://github.com/facebook/react/issues/10950
            Renderer_1.Renderer.batchedUpdates(function () {
                console.log("batched updates...");
            });
            Renderer_1.Renderer.unbatchedUpdates(function () {
                console.log("unbatched updates...");
            });
            Renderer_1.Renderer.flushSync(function () {
                console.log("flushing...");
                Renderer_1.Renderer.updateContainer(element, container, undefined, paintScreen);
            });
            Renderer_1.Renderer.deferredUpdates(function () {
                console.log("deferred updates...");
            });
        },
    };
})();
//# sourceMappingURL=LibMain.js.map
});
___scope___.file("lib/renderer/Renderer.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var emptyObject_1 = require("fbjs/lib/emptyObject");
var PIXI = require("pixi.js");
var ReactFiberReconciler = require("react-reconciler");
var Elements_1 = require("../elements/Elements");
var UpdateProps_1 = require("../props/UpdateProps");
var UPDATE_SIGNAL = {};
var appendChild = function (parentInstance, child) {
    //console.log("adding child", child.constructor.name);
    if (parentInstance.children.indexOf(child) !== -1) {
        parentInstance.removeChild(child);
    }
    parentInstance.addChild(child);
};
var removeChild = function (parentInstance, child) {
    //console.log("removing child", child.constructor.name);
    parentInstance.removeChild(child);
};
var insertBefore = function (parentInstance, child, beforeChild) {
    //console.log("swapping child", parentInstance.constructor.name, child.constructor.name);
    if (child !== beforeChild) {
        var index = parentInstance.children.indexOf(child);
        if (index !== -1) {
            parentInstance.children.splice(index, 1);
        }
        var beforeIndex = parentInstance.children.indexOf(beforeChild);
        parentInstance.children.splice(beforeIndex, 0, child);
    }
};
exports.Renderer = ReactFiberReconciler({
    createInstance: function (type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
        //console.log("creating", type);
        return Elements_1.createElement(type, props, rootContainerInstance);
    },
    /*
     *  Parent/Child Tree Updates
     */
    appendInitialChild: appendChild,
    appendChild: appendChild,
    appendChildToContainer: appendChild,
    insertBefore: insertBefore,
    insertInContainerBefore: insertBefore,
    removeChild: removeChild,
    removeChildFromContainer: removeChild,
    /*
     *  Sibling Tree Updates
     */
    /*
     * Updates
     */
    finalizeInitialChildren: function (testElement, type, props, rootContainerInstance) {
        //Give certain children last-minute updates (e.g. to auto-focus)
        return false;
    },
    //prepareUpdate seems to want to take advantage of async updates
    //both options are possible, though it seems option 2 is actually faster for our needs
    //OPTION 1 - use prepare update to filter changes then just apply in commit
    prepareUpdate: UpdateProps_1.prepPropChanges,
    commitUpdate: function (instance, updatePayload, type, oldProps, newProps, rootContainerInstance, internalInstanceHandle) {
        UpdateProps_1.applyPayload(type)(instance)(updatePayload);
    },
    /*
    //option 2 - let everything pass through prep, and then filter in commit
    prepareUpdate() {
        return UPDATE_SIGNAL
    },

    commitUpdate(instance: PIXI.DisplayObject, updatePayload, type, oldProps, newProps, rootContainerInstance, internalInstanceHandle) {
        
        const keys = Object.keys(newProps)
        .filter(filterPropKey(type))
        .forEach(key => {
                instance[key] = newProps[key];
        })
    },
*/
    /*
     * Prioritization - maybe return true if object is visually hidden
     */
    shouldDeprioritizeSubtree: function () {
        return false;
    },
    /*
     * Global side effects between commits
     */
    prepareForCommit: function () {
        //e.g. maybe temporarily disable all event listeners
        //can also stash global metadata
    },
    resetAfterCommit: function () {
        //e.g. maybe re-enable all event listeners
        //can also restore stashed metadata
    },
    /*
     * Text nodes
     */
    shouldSetTextContent: function (props) {
        return (typeof props.children === 'string' || typeof props.children === 'number');
    },
    resetTextContent: function (instance) {
        console.log("setting text?");
        instance.text = '';
    },
    createTextInstance: function (text, rootContainerInstance, hostContext, internalInstanceHandle) {
        return new PIXI.Text(text);
    },
    commitTextUpdate: function (textInstance, oldText, newText) {
        textInstance.text = newText;
    },
    /*
     * Ref instance (possibly?)
     */
    getPublicInstance: function (inst) {
        return inst;
    },
    /*
     * Handle low-priority work
     */
    scheduleDeferredCallback: function (fn) {
        if (window.requestIdleCallback) {
            window.requestIdleCallback(fn);
        }
        else {
            //not a great polyfill but w/e ;)
            setTimeout(fn, 0, { timeRemaining: Infinity });
        }
    },
    /*
     * Internal bookkeeping and flags
     */
    getRootHostContext: function (rootContainerInstance) {
        return emptyObject_1.emptyObject;
    },
    getChildHostContext: function (parentHostContext) {
        return emptyObject_1.emptyObject;
    },
    //In the future, turn this off ;)
    useSyncScheduling: true,
});
//# sourceMappingURL=Renderer.js.map
});
___scope___.file("lib/elements/Elements.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var wrapDisplayObject = function (props) { return function (displayObject) {
    if (typeof props.onAdded === 'function') {
        displayObject.addListener('added', function (container) {
            props.onAdded(displayObject, container);
        });
    }
    if (typeof props.onRemoved === 'function') {
        displayObject.addListener('removed', function (container) {
            props.onRemoved(displayObject, container);
        });
    }
    return displayObject;
}; };
var getSprite = function (_a) {
    var texture = _a.texture, props = __rest(_a, ["texture"]);
    return new PIXI.Sprite(texture);
};
var getText = function (_a) {
    var text = _a.text, style = _a.style, canvas = _a.canvas, props = __rest(_a, ["text", "style", "canvas"]);
    return new PIXI.Text(text, style, canvas);
};
exports.createElement = function (type, props, rootContainerInstance) {
    return wrapDisplayObject(props)((function () {
        switch (type) {
            case "container": return new PIXI.Container();
            case "graphics": return new PIXI.Graphics();
            case "text": return getText(props);
            case "sprite":
                return getSprite(props);
            default://console.log("UNKNOWN TYPE!", type); 
                return type;
        }
    })());
};
//# sourceMappingURL=Elements.js.map
});
___scope___.file("lib/props/UpdateProps.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TRANSFORM_KEYS = ["x", "y", "width", "height", "rotation"];
var TYPE_KEYS = {
    container: [].concat(TRANSFORM_KEYS),
    text: ["text", "style"].concat(TRANSFORM_KEYS),
    sprite: ["texture"].concat(TRANSFORM_KEYS)
};
exports.filterPropKey = function (type) { return function (key) {
    return TYPE_KEYS[type].indexOf(key) !== -1;
}; };
exports.prepPropChanges = function (testElement, type, oldProps, newProps, hostContext) {
    //console.log(newProps);
    var keyFilter = exports.filterPropKey(type);
    var keysToChange = Object.keys(newProps).filter(keyFilter);
    if (keysToChange.length) {
        var retObj_1 = {};
        keysToChange.forEach(function (key) {
            retObj_1[key] = newProps[key];
        });
        return retObj_1;
    }
    return false;
};
exports.applyPayload = function (type) { return function (instance) { return function (payload) {
    Object.keys(payload)
        .forEach(function (key) {
        instance[key] = payload[key];
    });
}; }; };
//# sourceMappingURL=UpdateProps.js.map
});
___scope___.file("lib/components/components.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var c = function (name) { return function (props) { return React.createElement(name, props); }; };
exports.Container = c('container');
exports.Text = c('text');
exports.Sprite = c('sprite');
//# sourceMappingURL=components.js.map
});
return ___scope___.entry = "lib/LibMain.ts";
});
FuseBox.target = "browser"
FuseBox.expose([{"alias":"ReactPixi","pkg":"react-pixi-renderer/lib/LibMain.js"}]);
FuseBox.main("react-pixi-renderer/lib/LibMain.js");
FuseBox.defaultPackageName = "react-pixi-renderer";
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((d||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),u=e.substring(o+1);return[a,u]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(d){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function u(e){return{server:require(e)}}function f(e,n){var o=n.path||"./",a=n.pkg||"default",f=r(e);if(f&&(o="./",a=f[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=f[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!d&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return u(e);var s=m[a];if(!s){if(d&&"electron"!==h.target)throw"Package not found "+a;return u(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,c=t(o,e),v=i(c),p=s.f[v];return!p&&v.indexOf("*")>-1&&(l=v),p||l||(v=t(c,"/","index.js"),p=s.f[v],p||"."!==c||(p=s.f[s.s&&s.s.entry]),p||(v=c+".js",p=s.f[v]),p||(p=s.f[c+".jsx"]),p||(v=c+"/index.jsx",p=s.f[v])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:c,validPath:v}}function s(e,r,n){if(void 0===n&&(n={}),!d)return r(/\.(js|json)$/.test(e)?v.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);h.dynamic(a,o),r(h.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=g[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=f(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=m[t.pkgName];if(u){var p={};for(var g in u.f)a.test(g)&&(p[g]=c(t.pkgName+"/"+g));return p}}if(!i){var h="function"==typeof r,x=l("async",[e,r]);if(x===!1)return;return s(e,function(e){return h?r(e):null},r)}var _=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var w=i.locals={},y=n(t.validPath);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return c(e,{pkg:_,path:y,v:t.versions})},d||!v.require.main?w.require.main={filename:"./",paths:[]}:w.require.main=v.require.main;var j=[w.module.exports,w.require,w.module,t.validPath,y,_];return l("before-import",j),i.fn.apply(0,j),l("after-import",j),w.module.exports}if(e.FuseBox)return e.FuseBox;var d="undefined"!=typeof window&&window.navigator,v=d?window:global;d&&(v.global=window),e=d&&"undefined"==typeof __fbx__dnm__?e:module.exports;var p=d?window.__fsbx__=window.__fsbx__||{}:v.$fsbx=v.$fsbx||{};d||(v.require=require);var m=p.p=p.p||{},g=p.e=p.e||{},h=function(){function r(){}return r.global=function(e,r){return void 0===r?v[e]:void(v[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){g[e]=g[e]||[],g[e].push(r)},r.exists=function(e){try{var r=f(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=f(e,{}),n=m[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var u=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);u(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=m.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(m[e])return n(m[e].s);var t=m[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=m,r.isBrowser=d,r.isServer=!d,r.plugins=[],r}();return d||(v.FuseBox=h),e.FuseBox=h}(this))
//# sourceMappingURL=react-pixi-renderer.js.map