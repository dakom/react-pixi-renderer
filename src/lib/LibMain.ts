import * as React from 'react';

const component = (name:string) => (props:any) => React.createElement(name, props);

export {ReactPixi} from "./renderer/Renderer";

export const Text = component('text');
export const Container = component('container');
export const Graphics = component('graphics');
export const Sprite = component('sprite');