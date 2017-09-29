import {WorldState} from "./World";
import {IoDynamics} from "../io/Io";

export const addBunnies = (bunnies:Array<any>) => {
    return bunnies;
}


const updateBunnyPositions = (bunnies:Array<any>) => {
    return bunnies;
}

export const updateBunnies = (ioDynamics:IoDynamics) => (worldState:WorldState):Promise<WorldState> => {
    const bunnies = ioDynamics.isTouching ? addBunnies(worldState.bunnies) : worldState.bunnies;
    return new Promise<WorldState>(resolve => {
        resolve(
            Object.assign({}, worldState, {
                bunnies: updateBunnyPositions(bunnies)
            })
        )
    })
}