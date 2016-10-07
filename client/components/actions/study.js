import React, { Component } from "react";
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TodayToDo from "../layouts/today_to_do";
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import {greenA200} from 'material-ui/styles/colors';
import { browserHistory } from "react-router";
import KeyHandler, {KEYPRESS} from 'react-key-handler';

class Study extends Component {

    constructor(props) {
        super(props);

        this.handleDoneDialogClose = this.handleDoneDialogClose.bind(this);

        this.state = {
            queue: [],
            showAnswer: false,
            doneDialogOpen: false
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            queue: props.queue
        });
    }

    componentDidMount() {

        {this.renderToDo()}
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

            } else {
                this.setState({
                    queue: queue,
                    showAnswer: false
                });
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
            }

        }
    }

    showAnswer() {
        this.setState({
            showAnswer: true
        })
    }

    handleSpaceEnter() {
        if(!this.state.showAnswer) {
            this.showAnswer();
        } else {
            this.answerCard("good");
        }
    }

    handleNumberKeypress(quality) {
        if(this.state.showAnswer) {
            this.answerCard(quality);
        }
    }

    handleDoneDialogClose() {/*
     this.setState({doneDialogOpen: false});*/
        browserHistory.push('/')
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
                onTouchTap={() => this.handleDoneDialogClose()}
            />
        ];

        return (
            <div>
                {this.renderToDo()}
                {this.renderFront()}
                {this.renderShowButton()}
                {this.renderBack()}
                <KeyHandler keyEventName={KEYPRESS} keyValue="Enter" onKeyHandle={() => this.handleSpaceEnter()} />
                <KeyHandler keyEventName={KEYPRESS} keyValue=" " onKeyHandle={() => this.handleSpaceEnter()} />
                <KeyHandler keyEventName={KEYPRESS} keyValue="1" onKeyHandle={() => this.handleNumberKeypress("again")} />
                <KeyHandler keyEventName={KEYPRESS} keyValue="2" onKeyHandle={() => this.handleNumberKeypress("hard")} />
                <KeyHandler keyEventName={KEYPRESS} keyValue="3" onKeyHandle={() => this.handleNumberKeypress("good")} />
                <KeyHandler keyEventName={KEYPRESS} keyValue="4" onKeyHandle={() => this.handleNumberKeypress("easy")} />
                <KeyHandler keyEventName={KEYPRESS} keyCode={43} onKeyHandle={() => this.handleNumberKeypress("again")} />
                <KeyHandler keyEventName={KEYPRESS} keyCode={283} onKeyHandle={() => this.handleNumberKeypress("hard")} />
                <KeyHandler keyEventName={KEYPRESS} keyCode={353} onKeyHandle={() => this.handleNumberKeypress("good")} />
                <KeyHandler keyEventName={KEYPRESS} keyCode={269} onKeyHandle={() => this.handleNumberKeypress("easy")} />

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