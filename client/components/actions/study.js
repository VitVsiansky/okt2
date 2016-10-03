import React, { Component } from "react";
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

class Study extends Component {

    constructor(props) {
        super(props);

        this.state = {
            queue: []
        }
    }

    componentWillReceiveProps() {
        this.setState({
            queue: this.props.queue
        })
    }

    answerCard(quality) {
        var id = this.state.queue[0]._id;
        var queue = this.state.queue;

        //Call server to update logs, no need to wait
        Meteor.call("answer.card", quality, id);


        //Handling repeats
        if(queue.length<15) {
            queue.push(queue[0]);
        } else {
            queue.splice(15, 0, queue[0]);
        }

        //Update view
        queue.shift();
        this.setState({
            queue: queue
        });

        console.log(this.state.queue);


    }

    renderCard() {
        if (this.state.queue.length > 0) {
            return (
                <div>
                <Paper zDepth={2}>
                    <div>
                        {this.state.queue[0].frontside}
                    </div>
                    <RaisedButton label="Znovu" primary={true} onClick={() => this.answerCard(0)}/>
                    <RaisedButton label="Dobre" secondary={true} onClick={() => this.answerCard(4)} />
                </Paper>
                </div>
            )
        }
    }

    render() {
        console.log(this.props);
        return (
            <div>
                {this.renderCard()}
            </div>
        )
    }
}

export default Study;