import * as React from "react";
import {Text} from "../../../../lib/LibMain";


export class Status extends React.Component<any, any> {
    private textWidth:number;
   
    componentDidMount() {
        this.setState({
            textWidth: this.textWidth
        })
    }

    render() {
        
        const fps = Math.round(1000/this.props.deltaTime).toString();
        const nBunnies = this.props.bunnies.length;

        
        return <Text 
            onAdded={(pixiText:PIXI.Text) => this.textWidth = pixiText.width}
            x={!this.state ? 0 : this.props.stageWidth - this.state.textWidth}
            text={`${fps} FPS w/ ${nBunnies.toString()} Bunnies`} style={{fill: 0xFF00FF}}
        />
    }
}

