
import * as PIXI from "pixi.js";
import * as React from "react";
import {WorldState} from "../world/World-State";

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
export const withIo = (app:PIXI.Application) => (worldUpdater) => (World) =>
    class extends React.PureComponent<IoState, IoState> {
        private renderCompleted: boolean = false;
        private dynamics:IoDynamics;

        constructor(props) {
            super(props);

            this.dynamics = {
                isTouching: false,
            }
            this.state = this.props;

            this.updateSize = this.updateSize.bind(this);
            this.repaint = this.repaint.bind(this);
        }

        /* Lifecycle */
        componentDidMount() {
            //Time
            const renderFrame = (frameNow) => {
                if (this.renderCompleted) {
                    
                    this.renderCompleted = false;

                    this.dynamics.deltaTime = this.dynamics.tick ? frameNow - this.dynamics.tick : 0;
                    this.dynamics.tick = frameNow;
                    
                    //merge io dynamics into old world
                    const worldState = Object.assign({}, {
                        ioDynamics: this.dynamics
                    }, this.state.worldState);

                    //update world
                    worldUpdater (worldState)
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
            app.renderer.plugins.interaction.on('pointerdown', () => {
                console.log("Spawning bunnies!!");
                this.dynamics.isTouching = true;
            });
            app.renderer.plugins.interaction.on('pointerup', () => {
                this.dynamics.isTouching = false;
            });

            //Display
            window.onresize = evt => this.updateSize();
            this.updateSize();

            //initial paint
            this.repaint();
        }

        componentDidUpdate() {
            this.repaint();
        }

        /* Utilities */

        repaint() {
            this.renderCompleted = true;
            app.render();
        }

        updateSize() {
            this.dynamics.stageWidth = window.innerWidth;
            this.dynamics.stageHeight = window.innerHeight;
            
            app.view.setAttribute('width', window.innerWidth.toString());
            app.view.setAttribute('height', window.innerHeight.toString());
            app.renderer.resize(window.innerWidth,window.innerHeight);
        }

        /* Render tree */
        render() {
            return <World {...this.state.worldState} />
        }
    }