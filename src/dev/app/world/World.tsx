
import * as PIXI from "pixi.js";
import * as React from "react";
import {IoDynamics} from "../io/Io";
import {loadAssets} from "../loader/Loader";
import {updateBunnies} from "./Bunnies";

export interface WorldState {
    texture?:PIXI.Texture;
    bunnies:Array<any>
}

export const GetInitialWorldState = ():WorldState => ({
    bunnies: []
});

export const worldUpdater = (ioDynamics:IoDynamics) => (worldState:WorldState):Promise<WorldState> =>
    (!worldState.texture) 
        ? loadAssets(worldState)
        : updateBunnies (ioDynamics) (worldState)

        