import { emptyObject } from 'fbjs/lib/emptyObject';
import * as PIXI from 'pixi.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom'
import * as ReactFiberReconciler from '../../temp-fb/FiberReconciler.development';


import { createElement } from '../elements/Elements';


const UPDATE_SIGNAL = {};

const appendChild = (parentInstance: PIXI.Container, child: PIXI.DisplayObject) => {

    if (parentInstance.children.indexOf(child) !== -1) {
        parentInstance.removeChild(child);
    }
    parentInstance.addChild(child);
}

const removeChild = (parentInstance: PIXI.Container, child: PIXI.DisplayObject) => {
    parentInstance.removeChild(child);
}

const insertBefore = (parentInstance: PIXI.Container, child: PIXI.DisplayObject, beforeChild: PIXI.DisplayObject) => {
    if (child !== beforeChild) {
        const index = parentInstance.children.indexOf(child);
        if (index !== -1) {
            parentInstance.children.splice(index, 1);
        }
        const beforeIndex = parentInstance.children.indexOf(beforeChild);
        parentInstance.children.splice(beforeIndex, 0, child);
    }
}

const Renderer = ReactFiberReconciler({
    createInstance(
        type,
        props,
        rootContainerInstance: PIXI.Application,
        hostContext,
        internalInstanceHandle,
    ) {
        return createElement(type, props, rootContainerInstance);
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
    finalizeInitialChildren(testElement, type, props, rootContainerInstance) {
        //Give certain children last-minute updates (e.g. to auto-focus)
        return false;
    },

    prepareUpdate(testElement, type, oldProps, newProps, hostContext) {
        //seems to be early diff tests to optionally prepare lists of changes or bail early
        //Not sure yet exactly how it translates to what's seen in commitUpdate
        return UPDATE_SIGNAL;
    },

    commitUpdate(instance: PIXI.DisplayObject, type, oldProps, newProps, rootContainerInstance, internalInstanceHandle) {
        //TODO!
        console.log("old props:", oldProps);
        console.log("new props:", newProps);

        console.log("updating?");

    },


    /*
     * Global side effects between commits
     */

    prepareForCommit() {
        //e.g. maybe temporarily disable all event listeners
        //can also stash global metadata
    },

    resetAfterCommit() {
        //e.g. maybe re-enable all event listeners
        //can also restore stashed metadata
    },

    /*
     * Text nodes
     */
    shouldSetTextContent(props) {
        return (
            typeof props.children === 'string' || typeof props.children === 'number'
        );
    },

    resetTextContent(instance: PIXI.Text) {
        console.log("setting text?");
        instance.text = '';
    },

    createTextInstance(text: string, rootContainerInstance, hostContext, internalInstanceHandle) {
        return new PIXI.Text(text);
    },

    commitTextUpdate(textInstance: PIXI.Text, oldText, newText) {
        textInstance.text = newText;
    },

    /*
     * Ref instance (possibly?)
     */
    getPublicInstance(inst) {
        return inst;
    },

    /*
     * Handle low-priority work
     */
    scheduleDeferredCallback(fn: Function): void {
        if ((window as any).requestIdleCallback) {
            (window as any).requestIdleCallback(fn);
        } else {
            //not a great polyfill but w/e ;)
            setTimeout(fn, 0, { timeRemaining: Infinity });
        }
    },

    /*
     * Internal bookkeeping and flags
     */

    getRootHostContext(rootContainerInstance) {
        return emptyObject;
    },

    getChildHostContext(parentHostContext) {
        return emptyObject;
    },

    //In the future, turn this off ;)
    useSyncScheduling: true,
});

export const ReactPixi = (function () {
    let container: any;

    return {
        render: (element: React.Element<any>, app: PIXI.Application) => {
            if (!container) {
                container = Renderer.createContainer(app.stage);
            }

            Renderer.unbatchedUpdates(() => {
                console.log("updating...");
                Renderer.updateContainer(element, container);

                console.log(app.stage.children);
                app.render();
            });
        }
    }
})();
