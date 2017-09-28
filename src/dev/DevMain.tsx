import * as PIXI from "pixi.js";
import * as React from "react";
import {ReactPixi, Text, Container} from "../lib/LibMain";

const app = new PIXI.Application({
    width: window.innerWidth, 
    height: window.innerHeight, 
    backgroundColor: 0x2a2a2a,
    view: document.getElementById("canvas") as HTMLCanvasElement,
    autoStart: false,
    });

const World = () => (
    <Container>
        <Text text="Hello world!" style={{fill: 0xFF00FF}} />
    </Container>
)

ReactPixi.render(<World />, app);