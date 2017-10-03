
import * as PIXI from "pixi.js";
import {WorldState} from "../world/World-State";

export const LogInfo = (app:PIXI.Application) => (worldState:WorldState) => {
    console.log(`world bunnies: ${worldState.bunnies.length}`);
    

    const logChildren = (target:PIXI.Container) => {
        console.log(target.constructor.name, target.children.length);
        target.children.forEach(child => {
            logChildren(child as PIXI.Container);
        })
    }

    console.log(`children hierarchy:`);
    logChildren(app.stage);
}