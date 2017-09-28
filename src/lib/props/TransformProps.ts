import * as PIXI from "pixi.js";

export const applyTransform = (props) => (target:PIXI.DisplayObject) => {
    if(props.x !== undefined) { target.position.x = props.x};
    if(props.y !== undefined) { target.position.y = props.y};
    if(props.scaleX !== undefined) { target.scale.x = props.x};
    if(props.scaleY !== undefined) { target.scale.y = props.y};
    if(props.rotation !== undefined) {target.rotation = props.rotation};
}