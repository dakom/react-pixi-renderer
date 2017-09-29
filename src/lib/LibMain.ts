import * as React from 'react';
import {Renderer} from "./renderer/Renderer";

const c = name => props => React.createElement(name, props);

export const Container = c('container');
export const Text = c('text');
export const Sprite = c('sprite');


export const ReactPixi = (function () {
    let container: any;

    return {
        render: (element: React.Element<any>, app: PIXI.Application) => {
            if (!container) {
                container = Renderer.createContainer(app.stage);
            }

            console.log("updating...");

            Renderer.unbatchedUpdates(() => {
                
                Renderer.updateContainer(element, container);

                app.render();
            });
        },

        createPortal: (
            children: ReactNodeList,
            containerTag: number,
            key: ?string = null,
          ) => {
            return ReactPortal.createPortal(children, containerTag, null, key);
          },
    }
})();


