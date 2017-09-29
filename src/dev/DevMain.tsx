import * as PIXI from 'pixi.js';
import * as React from 'react';

import { ReactPixi } from '../lib/LibMain';
import { withIo } from './app/io/Io';
import { WorldUpdater } from './app/world/World-Updater';
import { WorldView } from './app/world/World-View';
import {GetInitialWorldState} from "./app/world/World-State";

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x2a2a2a,
    view: document.getElementById("canvas") as HTMLCanvasElement,
    autoStart: false,
});

const World = withIo (app) (WorldUpdater) (WorldView);

ReactPixi.render (<World worldState={GetInitialWorldState()} />, app.stage);