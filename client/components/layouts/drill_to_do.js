import React, { Component } from "react";
import LinearProgress from 'material-ui/LinearProgress';

class DrillToDo extends Component {
    render() {
        return (
            <div>
                <LinearProgress style={{height:5}} mode="determinate" value={this.props.done} />
            </div>
        );
    }
}

export default DrillToDo;