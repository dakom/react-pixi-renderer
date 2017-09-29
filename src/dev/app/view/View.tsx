import * as PIXI from "pixi.js";
import * as React from "react";
import {Text, Container, Sprite} from "../../../lib/LibMain";


export const View = props => {
    const text = (props.texture) ? "ready!" :  "loading...";

    //console.log(text);

return (<Container>
        {
            (!props.texture) 
            ? <Text text={text} style={{fill: 0xFF00FF}} />
            : <Sprite texture={props.texture} x={100} y={100} />
        }
        
    </Container>
)
}
    