import * as PIXI from 'pixi.js';
import * as React from 'react';
import {Bunny} from "./bunnies/Bunnies-Data";
import {generateBunnies} from "./bunnies/Bunnies-Generator";

export interface WorldState {
    texture?:PIXI.Texture;
    bunnies:Array<Bunny>;
    deltaTime:number;
}

export const GetInitialWorldState = ():WorldState => ({
    bunnies: generateBunnies(2),
    deltaTime: 0
});



        