import * as PIXI from "pixi.js";

interface DisplayObjectProps {
    onAdded?: (child:PIXI.DisplayObject, container:PIXI.Container) => void;
    onRemoved?: (child:PIXI.DisplayObject, container:PIXI.Container) => void;
}

const wrapDisplayObject = (props: DisplayObjectProps) => (displayObject: PIXI.DisplayObject) => {
    if (typeof props.onAdded === 'function') {
        displayObject.addListener('added', container => {
            props.onAdded(displayObject, container);
        });
    }

    if (typeof props.onRemoved === 'function') {
        displayObject.addListener('removed', container => {
            props.onRemoved(displayObject, container);
        });
    }

    return displayObject;
}

const getSprite = ({ texture, ...props }): PIXI.Sprite => {
    return new PIXI.Sprite(texture);
}

const getText = ({ text, style, canvas, ...props }): PIXI.Text => {


    return new PIXI.Text(text, style, canvas);
}


export const createElement = (type, props, rootContainerInstance: PIXI.Application) => 
    wrapDisplayObject(props) (
        (() => {
            switch (type) {
                case "container": return new PIXI.Container();
                case "graphics": return new PIXI.Graphics();
                case "text": return getText(props);
                case "sprite": 
                    return getSprite(props);
                default: //console.log("UNKNOWN TYPE!", type); 
                    return type;
            }
        })()
    );

