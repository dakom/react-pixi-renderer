import * as React from "react";
import {Text} from "../../../../lib/LibMain";
export const Status = ({deltaTime, bunnies}) => {
    const fps = Math.round(1000/deltaTime).toString();

    return <Text text={`${fps} FPS w/ ${bunnies.length.toString()} Bunnies`} style={{fill: 0xFF00FF}}/>
}
    

