import * as PIXI from 'pixi.js';
import * as React from 'react';
import {Bunny} from "./bunnies/Bunnies-Data";
import {generateBunnies} from "./bunnies/Bunnies-Generator";
import { IoDynamics } from '../io/Io';

export interface WorldState {
    bunnies:Array<Bunny>;
    texture?:PIXI.Texture;
    ioDynamics?:IoDynamics;
}

export const GetInitialWorldState = ():WorldState => ({
    bunnies: generateBunnies(2)
});



        