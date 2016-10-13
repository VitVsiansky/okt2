import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import {greenA200} from 'material-ui/styles/colors';
import FlashOn from 'material-ui/svg-icons/image/flash-on';
import {orange600} from 'material-ui/styles/colors';
import DrillToDo from "../layouts/drill_to_do";
import KeyHandler, {KEYPRESS} from 'react-key-handler';

const dialogStyle = {
    width: '100%',
    maxWidth: 'none',
};

class Drill extends Component {
    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.repeatDrill = this.repeatDrill.bind(this);

        this.state = {
            dialogOpen: false,
            queue: [],
            unchangedQueue: [],
            showAnswer: false,
            drillDone: false,
            cardsDone: 0
        }
    }


    handleOpen() {
        this.setState({dialogOpen: true});
    }

    handleClose() {
        this.setState({
            dialogOpen: false,
            queue: [],
            unchangedQueue: [],
            showAnswer: false,
            drillDone: false,
            cardsDone: 0
        });
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

    repeatDrill() {
        this.setState({
            queue: this.state.unchangedQueue,
            drillDone: false,
            showAnswer: false
        })
    }

    answerCard(quality) {

        var queue = this.state.queue;

        //Handling repeats
        if(quality==="again") {
            if(queue.length<15) {
                queue.push(queue[0]);
            } else {
                queue.splice(15, 0, queue[0]);
            }

            queue.shift();


            if(queue.length === 0) {
                this.setState({
                    drillDone: true,
                    cardsDone: 100
                });
            } else {
                this.setState({
                    queue: queue,
                    showAnswer: false,
                    cardsDone: (this.state.unchangedQueue.length - queue.length)/this.state.unchangedQueue.length*100
                });


            }
        } else {

            //Update view
            queue.shift();

            if(queue.length === 0) {
                this.setState({
                    drillDone: true,
                    cardsDone: 100
                });
            } else {
                this.setState({
                    queue: queue,
                    showAnswer: false,
                    cardsDone: (this.state.unchangedQueue.length - queue.length)/this.state.unchangedQueue.length*100
                });

            }

        }
    }

    componentWillReceiveProps(props) {
        cards = JSON.parse(JSON.stringify(props.selectedTopic));
        cardss = JSON.parse(JSON.stringify(props.selectedTopic));
        this.setState({
            queue: cards.cards,
            unchangedQueue: cardss.cards
        });

    }



    renderFront() {
            if (this.state.queue.length > 0) {
                return (
                    <div>
                        <Paper zDepth={2}>
                            <div style={{paddingTop:30, paddingBottom:30, fontSize: 22, textAlign: "center"}}
                                 dangerouslySetInnerHTML={{__html: this.state.queue[0].frontside}}>
                            </div>
                        </Paper>

                    </div>
                )
            }

        }


    renderShowButton() {
        if(this.state.queue) {
            if(!this.state.showAnswer && this.state.queue.length > 0) {
                return (
                    <RaisedButton label="Odpověď" primary={true} onClick={() => this.showAnswer()} style={{display:"block", margin:"0 auto"}}/>
                );
            }
        }
        }


    renderBack() {
        if(this.state.showAnswer && this.state.queue.length > 0) {
            return (
                <div>
                    <Paper zDepth={2} style={{marginTop: 20, paddingBottom: 40}}>
                        <div style={{paddingTop:20, paddingBottom:20, fontSize: 22, textAlign: "center"}}
                             dangerouslySetInnerHTML={{__html: this.state.queue[0].backside}}>
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
                            label="Správně"
                            icon={<FontIcon className="material-icons">done</FontIcon>}
                            onTouchTap={() => this.answerCard("good")}
                        />

                    </BottomNavigation>
                </div>
            );
        }
    }

    renderDrillDone() {
        if(this.state.drillDone) {
            return (
                <div style={{textAlign:"center"}}>
                    <FontIcon className="material-icons" color={greenA200} style={{fontSize:"5em", marginBottom:15}}>done</FontIcon>
                    <br/>
                    Dril je hotov! Chcete si ho dát znova?
                    <br />
                    <RaisedButton label="Zopakovat" secondary={true} onTouchTap={this.repeatDrill} style={{marginTop:25}}/>
                </div>
            );
        }
    }

    render() {

        const actions = [
            <FlatButton
                label="Zavřít"
                primary={true}
                onTouchTap={this.handleClose}
            />
        ];


        return (
            <div>
                <KeyHandler keyEventName={KEYPRESS} keyValue="Enter" onKeyHandle={() => this.handleSpaceEnter()} />
                <KeyHandler keyEventName={KEYPRESS} keyValue=" " onKeyHandle={() => this.handleSpaceEnter()} />
                <KeyHandler keyEventName={KEYPRESS} keyValue="1" onKeyHandle={() => this.handleNumberKeypress("again")} />
                <KeyHandler keyEventName={KEYPRESS} keyValue="3" onKeyHandle={() => this.handleNumberKeypress("good")} />
                <KeyHandler keyEventName={KEYPRESS} keyCode={43} onKeyHandle={() => this.handleNumberKeypress("again")} />
                <KeyHandler keyEventName={KEYPRESS} keyCode={353} onKeyHandle={() => this.handleNumberKeypress("good")} />

                <RaisedButton label="Dril"
                              onTouchTap={this.handleOpen}
                              icon={<FlashOn />}
                              backgroundColor={orange600}
                              fullWidth={true}
                              labelPosition="before"/>
                <Dialog
                    title={"Dril: " + this.props.selectedTopic.name}
                    actions={actions}
                    modal={true}
                    autoScrollBodyContent={true}
                    contentStyle={dialogStyle}
                    open={this.state.dialogOpen}
                >
                    <DrillToDo done={this.state.cardsDone}/>
                    {this.renderFront()}
                    {this.renderShowButton()}
                    {this.renderBack()}
                    {this.renderDrillDone()}
                </Dialog>
            </div>
        );
    }
}

export default Drill;