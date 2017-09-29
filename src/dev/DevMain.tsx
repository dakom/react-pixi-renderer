import * as PIXI from "pixi.js";
import * as React from "react";
import { ReactPixi } from "../lib/LibMain";
import {worldUpdater} from "./app/world/World";
import {withIo} from "./app/io/Io";
import {View} from "./app/view/View";

const Instantiate = React.createElement;

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x2a2a2a,
    view: document.getElementById("canvas") as HTMLCanvasElement,
    autoStart: false,
});

ReactPixi.render (
    Instantiate(withIo (app) (worldUpdater) (View), {app: app}), 
    app
);

