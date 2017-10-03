import * as React from 'react';
import {Renderer} from "./renderer/Renderer";

export * from "./components/components";

export const ReactPixi = (function () {
    let container: any;

    return {
        render: (element:any, pixiContainer:PIXI.Container, paintScreen?:() => void) => {
            if (!container) {
                container = Renderer.createContainer(pixiContainer);
            }

            /*const doUpdate = () => {
                
            }
*/
            //Kindof just assigning randomly to one of these for now
            //See https://github.com/facebook/react/issues/10950

            Renderer.batchedUpdates(() => {
                console.log("batched updates...");
            });

            Renderer.unbatchedUpdates(() => {
                console.log("unbatched updates...");
            });

            Renderer.flushSync(() => {
                console.log("flushing...");
                Renderer.updateContainer(element, container, undefined, paintScreen);
            });

            Renderer.deferredUpdates(() => {
                console.log("deferred updates...");
            });

            
        },
    }
})();


