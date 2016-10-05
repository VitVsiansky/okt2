import React, { Component } from "react";
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TodayToDo from "../layouts/today_to_do";
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import {greenA200} from 'material-ui/styles/colors';

class Study extends Component {

    constructor(props) {
        super(props);

        this.state = {
            queue: [],
            showAnswer: false,
            doneDialogOpen: false
        }
    }


    componentWillReceiveProps(props) {
        console.log("recieving props");
        console.log(props);
        this.setState({
            queue: props.queue
        });
        console.log(this.state);
    }

    componentDidMount() {

        {this.renderToDo()}
        console.log("did mount");
    }

    renderToDo() {
        return (
            <TodayToDo/>
        );
    }

    answerCard(quality) {
        var id = this.state.queue[0]._id;
        var queue = this.state.queue;

        //Call server to update logs, no need to wait
        Meteor.call("answer.card", quality, id);


        //Handling repeats
        if(quality==="again") {
            if(queue.length<15) {
                queue.push(queue[0]);
            } else {
                queue.splice(15, 0, queue[0]);
            }

            queue.shift();

            if(queue.length === 0) {
                console.log("ALL DONE");
            } else {
                this.setState({
                    queue: queue,
                    showAnswer: false
                });
                console.log(this.state.queue);
            }
        } else {

            //Update view
            queue.shift();

            if(queue.length === 0) {
                this.setState({
                    queue: queue,
                    showAnswer: false,
                    doneDialogOpen: true
                });
            } else {
                this.setState({
                    queue: queue,
                    showAnswer: false
                });
                console.log(this.state.queue);
            }

        }
    }

    showAnswer() {
        this.setState({
            showAnswer: true
        })
    }

    handleDoneDialogClose() {
        this.setState({doneDialogOpen: false});
    }

    renderFront() {
        if (this.state.queue.length > 0) {
            return (
                <div>
                    <Paper zDepth={2}>
                        <div style={{paddingTop:30, paddingBottom:30, fontSize: 22, textAlign: "center"}}>
                            {this.state.queue[0].frontside}
                        </div>
                        <Paper zDepth={1}>





                        </Paper>
                    </Paper>

                </div>
            )
        }
    }

    renderShowButton() {
        if(!this.state.showAnswer) {
            return (
                <RaisedButton label="Odpověď" primary={true} onClick={() => this.showAnswer()} style={{display:"block", margin:"0 auto"}}/>
            );
        }
    }

    renderBack() {
        if(this.state.showAnswer) {
            console.log("back");
            return (
                <div>
                    <Paper zDepth={2} style={{marginTop: 20, paddingBottom: 40}}>
                        <div style={{paddingTop:20, paddingBottom:20, fontSize: 22, textAlign: "center"}}>
                            {this.state.queue[0].backside}
                        </div>
                        <img src={this.state.queue[0].image} style={{display:"block", margin:"0 auto"}} />
                    </Paper>

                    <BottomNavigation style={{bottom:0, position:"fixed", opacity:0.8}}>
                        <BottomNavigationItem
                            label="Znovu"
                            icon={<FontIcon className="material-icons">autorenew</FontIcon>}
                            onTouchTap={() => this.answerCard("again")}
                        />
                        <BottomNavigationItem
                            label="Těžké"
                            icon={<FontIcon className="material-icons">error_outline</FontIcon>}
                            onTouchTap={() => this.answerCard("hard")}
                        />
                        <BottomNavigationItem
                            label="Správně"
                            icon={<FontIcon className="material-icons">done</FontIcon>}
                            onTouchTap={() => this.answerCard("good")}
                        />
                        <BottomNavigationItem
                            label="Snadné"
                            icon={<FontIcon className="material-icons">done_all</FontIcon>}
                            onTouchTap={() => this.answerCard("easy")}
                        />
                    </BottomNavigation>
                </div>
            );
        }
    }

    render() {
        const doneDialogActions = [
            <FlatButton
                label="Zpátky"
                primary={true}
                onTouchTap={() => this.handleDoneDialogClose}
            />
        ];

        console.log(this.props);
        return (
            <div>
                {this.renderToDo()}
                {this.renderFront()}
                {this.renderShowButton()}
                {this.renderBack()}
                <Dialog
                    title="Hotovo!"
                    actions={doneDialogActions}
                    modal={true}
                    open={this.state.doneDialogOpen}
                >
                    <div style={{textAlign:"center"}}>
                    <FontIcon className="material-icons" color={greenA200} style={{fontSize:"5em", marginBottom:15}}>done</FontIcon>
                    <br/>
                    Pro dnešek máte všechno zopakováno. Dobrá práce!
                        </div>
                </Dialog>
            </div>
        )
    }
}

export default Study;