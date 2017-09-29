import * as PIXI from "pixi.js";
import * as React from "react";
import {Text, Container, Sprite} from "../../../lib/LibMain";
import {Bunnies} from "./bunnies/Bunnies-View";
import {Status} from "./status/Status-View";

export const WorldView = props => 
    <Container>
        {
            (!props.texture) 
            ?   <Text text={(props.texture) ? "ready!" :  "loading..."} style={{fill: 0xFF00FF}} />
            :   <Container>
                    <Bunnies texture={props.texture} bunnies={props.bunnies} /> 
                    <Status deltaTime={props.deltaTime} bunnies={props.bunnies} />
                </Container>
        }
        
    </Container>
    