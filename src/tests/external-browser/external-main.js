const app = new PIXI.Application({
    width: window.innerWidth, 
    height: window.innerHeight, 
    backgroundColor: 0x2a2a2a,
    view: document.getElementById("canvas"),
    autoStart: false,
    });


const e = React.createElement;

const World = 
    e('container', null,
        e('text', {
            text: 'hello world!',
            style: {
                fill: 0xFF00FF
            }
        })
    );

ReactPixi.ReactPixi.render(World, app);