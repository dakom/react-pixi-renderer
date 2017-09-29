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

            const doUpdate = () => {
                Renderer.updateContainer(element, container);
                if(paintScreen) {
                    paintScreen();
                }
            }

            //Kindof just assigning randomly to one of these for now

            Renderer.batchedUpdates(() => {
                console.log("batched updates...");
            });

            Renderer.unbatchedUpdates(() => {
                console.log("unbatched updates...");
            });

            Renderer.flushSync(() => {
                console.log("flushing...");

                doUpdate();
            });

            Renderer.deferredUpdates(() => {
                console.log("deferred updates...");
            });

            
        },
    }
})();


