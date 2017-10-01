import {WorldState} from "../World-State";
import {generateBunnies} from "./Bunnies-Generator";
import {Bunny} from "./Bunnies-Data";

export const addBunnies = (bunnies:Array<Bunny>) => {
    return bunnies.concat(generateBunnies());
}

const updateBunnyPositions = (bunnies:Array<Bunny>) => ([stageWidth, stageHeight]) =>
    //movement is made to match https://github.com/pixijs/bunny-mark/blob/master/src/Bunny.js
    bunnies.map(oldBunny => {
        const bunny = Object.assign({}, oldBunny);

        bunny.position.x += bunny.direction.x;
        bunny.position.y += bunny.direction.y;
        bunny.direction.y += 0.75;
    
        if (bunny.position.x > stageWidth) {
            bunny.direction.x *= -1;
            bunny.position.x = stageWidth;
        }
        else if (bunny.position.x < 0) {
            bunny.direction.x *= -1;
            bunny.position.x = 0;
        }
    
        if (bunny.position.y > stageHeight) {
            bunny.direction.y *= -0.85;
            bunny.position.y = stageHeight;
            if (Math.random() > 0.5) {
                bunny.direction.y -= Math.random() * 6;
            }
        }
        else if (bunny.position.y < 0) {
            bunny.direction.y = 0;
            bunny.position.y = 0;
        }

        return bunny;
    })

export const updateBunnies = (worldState:WorldState):Array<Bunny> => {
    const bunnies = worldState.ioDynamics.isTouching ? addBunnies(worldState.bunnies) : worldState.bunnies;
    return updateBunnyPositions (bunnies) ([worldState.ioDynamics.stageWidth, worldState.ioDynamics.stageHeight])
}