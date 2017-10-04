import * as React from "react";

import {Text, Container, Sprite} from "../../../../lib/LibMain";
import {Bunny} from "./Bunnies-Data";

console.log(Sprite);

export const Bunnies = ({texture, bunnies}) => 
(
    <Container>
        {
            bunnies.map((bunny:Bunny, index) => <Sprite key={index} texture={texture} x={bunny.position.x} y={bunny.position.y} />)
        }
    </Container>
)