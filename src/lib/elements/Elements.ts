import * as PIXI from "pixi.js";
import {applyTransform} from "../props/TransformProps";

const getSprite = ({texture, ...props}):PIXI.Sprite => {
    return new PIXI.Sprite(texture);
}

const getText = ({text, style, canvas, ...props}):PIXI.Text => {
    return new PIXI.Text(text, style, canvas);
}

export const createElement = (type, props, rootContainerInstance:PIXI.Application) => {
    const transform = applyTransform(props);
    

    const element = (() => {
        switch(type) {
            case "container": return new PIXI.Container();
            case "graphics": return new PIXI.Graphics();
            case "text": return getText(props);
            case "sprite": return getSprite(props);
            default: console.log("UNKNOWN TYPE!", type); return null;
        }
    })();

    if(element !== null) {
        transform(element);
    }

    return element;
}