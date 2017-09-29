import {Bunny} from "./Bunnies-Data";

export const generateBunnies = (amount:number = 100):Array<Bunny> => {
    const bunnies = new Array<Bunny>(amount);

    for(let idx = 0; idx < amount; idx++) {
        bunnies[idx] = {
            position: {
                x: 0,
                y: 0
            },
            direction: {
                x: Math.random() * 10,
                y: (Math.random() * 10) - 5
            }
        }
    }

    return bunnies;
}