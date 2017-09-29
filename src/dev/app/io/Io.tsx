
import * as PIXI from "pixi.js";
import * as React from "react";
import {WorldState, GetInitialWorldState} from "../world/World";

interface IoProps {
    app:PIXI.Application;
}

interface IoState {
    worldState: WorldState;
}

export interface IoDynamics {
    isTouching:boolean;
    tick?:number;
    deltaTime?:number;
    stageWidth?:number;
    stageHeight?:number;
}

//Grabs all current Input/Output values and passes them down on frame ticks (if not busy with a previous render)
//A WorldUpdater must be supplied and checked all the way here at the top - otherwise the renderer has no way of knowing when its finished
//It's written as a Higher Order Component so it can wrap around a React View
export const withIo = (app:PIXI.Application) => (worldUpdater) => (ViewComponent) =>
    class extends React.PureComponent<IoProps, any> {
        private renderCompleted: boolean = true;
        private dynamics:IoDynamics;

        constructor(props:IoProps) {
            super(props);

            this.dynamics = {
                isTouching: false,
            }
            this.state = {
                worldState: GetInitialWorldState()
            }

            this.updateSize = this.updateSize.bind(this);
        }

        updateSize() {
            this.dynamics.stageWidth = window.innerWidth;
            this.dynamics.stageHeight = window.innerHeight;
            
            this.props.app.view.setAttribute('width', window.innerWidth.toString());
            this.props.app.view.setAttribute('height', window.innerHeight.toString());
            this.props.app.renderer.resize(window.innerWidth,window.innerHeight);
        }

        componentDidMount() {
            //Time
            const renderFrame = (frameNow) => {
                if (this.renderCompleted) {
                    
                    this.renderCompleted = false;

                    this.dynamics.deltaTime = this.dynamics.tick ? frameNow - this.dynamics.tick : 0;
                    this.dynamics.tick = frameNow;
                    
                   
                    worldUpdater (this.dynamics) (this.state.worldState)
                        .then(newWorld => {
                            this.setState({
                                worldState: newWorld
                            });
                        })
                    
                }
                requestAnimationFrame(renderFrame);
            }
            requestAnimationFrame(renderFrame);

            //Input
            this.props.app.renderer.plugins.interaction.on('pointerdown', () => {
                console.log("Spawning bunnies!!");
                this.dynamics.isTouching = true;
            });
            this.props.app.renderer.plugins.interaction.on('pointerup', () => {
                this.dynamics.isTouching = false;
            });

            //Display
            window.onresize = evt => this.updateSize();
            this.updateSize();
        }

        componentDidUpdate() {
            //console.log(app.stage.children);
            this.renderCompleted = true;
            app.render();

            
        }

        render() {
            return <ViewComponent {...this.state.worldState} />
        }
    }