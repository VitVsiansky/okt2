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
import IconButton from 'material-ui/IconButton';

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
                        <div style={{paddingTop:30, paddingBottom:30, fontSize: 22, textAlign: "center"}} dangerouslySetInnerHTML={{__html: this.state.queue[0].frontside}}>
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






    renderWikiskripta() {
        if(this.state.queue[0].wikiskripta) {
            return (
                <a href={this.state.queue[0].wikiskripta} target="_blank" >
                    <IconButton tooltip="Wikiskripta">
                        <svg id="icon-library" viewBox="0 0 34 32" style={{width: 32, height:32}}>
                            <title>wikiskripta</title>
                            <path class="path1" d="M32 30v-2h-2v-12h2v-2h-6v2h2v12h-6v-12h2v-2h-6v2h2v12h-6v-12h2v-2h-6v2h2v12h-6v-12h2v-2h-6v2h2v12h-2v2h-2v2h34v-2h-2z"></path>
                            <path class="path2" d="M16 0h2l16 10v2h-34v-2l16-10z"></path>
                        </svg>
                    </IconButton>
                </a>
            );
        }
    }

    renderWikipedia() {
        if(this.state.queue[0].wikipedia) {
            return (
                <a href={this.state.queue[0].wikipedia} target="_blank" >
                    <IconButton tooltip="Wikipedia">
                        <svg id="icon-wikipedia" viewBox="0 0 32 32" style={{width: 32, height:32}}>
                            <title>wikipedia</title>
                            <path class="path1" d="M30.212 7.3c0 0.1-0.031 0.194-0.094 0.281-0.063 0.081-0.131 0.125-0.212 0.125-0.625 0.063-1.137 0.263-1.531 0.6-0.4 0.338-0.806 0.994-1.225 1.95l-6.45 14.544c-0.044 0.137-0.163 0.2-0.356 0.2-0.15 0-0.269-0.069-0.356-0.2l-3.619-7.563-4.162 7.563c-0.088 0.137-0.2 0.2-0.356 0.2-0.188 0-0.306-0.069-0.369-0.2l-6.331-14.537c-0.394-0.9-0.813-1.531-1.25-1.887s-1.050-0.581-1.831-0.662c-0.069 0-0.131-0.037-0.188-0.106-0.063-0.069-0.087-0.15-0.087-0.244 0-0.237 0.069-0.356 0.2-0.356 0.562 0 1.156 0.025 1.775 0.075 0.575 0.050 1.112 0.075 1.619 0.075 0.513 0 1.125-0.025 1.825-0.075 0.731-0.050 1.381-0.075 1.95-0.075 0.137 0 0.2 0.119 0.2 0.356s-0.044 0.35-0.125 0.35c-0.563 0.044-1.012 0.188-1.338 0.431s-0.487 0.563-0.487 0.963c0 0.2 0.069 0.456 0.2 0.756l5.231 11.825 2.975-5.613-2.769-5.806c-0.5-1.037-0.906-1.706-1.225-2.006s-0.806-0.481-1.456-0.55c-0.063 0-0.113-0.037-0.169-0.106s-0.081-0.15-0.081-0.244c0-0.237 0.056-0.356 0.175-0.356 0.563 0 1.081 0.025 1.556 0.075 0.456 0.050 0.938 0.075 1.456 0.075 0.506 0 1.037-0.025 1.606-0.075 0.581-0.050 1.156-0.075 1.719-0.075 0.137 0 0.2 0.119 0.2 0.356s-0.038 0.35-0.125 0.35c-1.131 0.075-1.694 0.4-1.694 0.963 0 0.25 0.131 0.644 0.394 1.175l1.831 3.719 1.825-3.4c0.25-0.481 0.381-0.887 0.381-1.213 0-0.775-0.563-1.188-1.694-1.237-0.1 0-0.15-0.119-0.15-0.35 0-0.088 0.025-0.162 0.075-0.237s0.1-0.112 0.15-0.112c0.406 0 0.9 0.025 1.494 0.075 0.563 0.050 1.031 0.075 1.394 0.075 0.262 0 0.644-0.025 1.15-0.063 0.637-0.056 1.175-0.088 1.606-0.088 0.1 0 0.15 0.1 0.15 0.3 0 0.269-0.094 0.406-0.275 0.406-0.656 0.069-1.188 0.25-1.587 0.544s-0.9 0.963-1.5 2.013l-2.444 4.475 3.288 6.7 4.856-11.294c0.169-0.412 0.25-0.794 0.25-1.137 0-0.825-0.563-1.263-1.694-1.319-0.1 0-0.15-0.119-0.15-0.35 0-0.237 0.075-0.356 0.225-0.356 0.413 0 0.9 0.025 1.469 0.075 0.525 0.050 0.962 0.075 1.313 0.075 0.375 0 0.8-0.025 1.288-0.075 0.506-0.050 0.962-0.075 1.369-0.075 0.125 0 0.188 0.1 0.188 0.3z"></path>
                        </svg>
                    </IconButton>
                </a>
            );
        }
    }

    renderLiteratura() {
        if(this.state.queue[0].literature) {
            return (

                <IconButton tooltip="Literatura">
                    <svg id="icon-book" viewBox="0 0 32 32" style={{width: 32, height:32}}>
                        <title>literatura</title>
                        <path class="path1" d="M28 4v26h-21c-1.657 0-3-1.343-3-3s1.343-3 3-3h19v-24h-20c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24v-28h-2z"></path>
                        <path class="path2" d="M7.002 26v0c-0.001 0-0.001 0-0.002 0-0.552 0-1 0.448-1 1s0.448 1 1 1c0.001 0 0.001-0 0.002-0v0h18.997v-2h-18.997z"></path>
                    </svg>
                </IconButton>
            );
        }
    }

    renderExtraLink() {
        if(this.state.queue[0].extraLink) {
            return (
                <a href={this.state.queue[0].extraLink} target="_blank">
                    <IconButton tooltip="Externí zdroj">
                        <svg id="icon-link" viewBox="0 0 32 32" style={{width: 32, height:32}}>
                            <title>link</title>
                            <path class="path1" d="M13.757 19.868c-0.416 0-0.832-0.159-1.149-0.476-2.973-2.973-2.973-7.81 0-10.783l6-6c1.44-1.44 3.355-2.233 5.392-2.233s3.951 0.793 5.392 2.233c2.973 2.973 2.973 7.81 0 10.783l-2.743 2.743c-0.635 0.635-1.663 0.635-2.298 0s-0.635-1.663 0-2.298l2.743-2.743c1.706-1.706 1.706-4.481 0-6.187-0.826-0.826-1.925-1.281-3.094-1.281s-2.267 0.455-3.094 1.281l-6 6c-1.706 1.706-1.706 4.481 0 6.187 0.635 0.635 0.635 1.663 0 2.298-0.317 0.317-0.733 0.476-1.149 0.476z"></path>
                            <path class="path2" d="M8 31.625c-2.037 0-3.952-0.793-5.392-2.233-2.973-2.973-2.973-7.81 0-10.783l2.743-2.743c0.635-0.635 1.664-0.635 2.298 0s0.635 1.663 0 2.298l-2.743 2.743c-1.706 1.706-1.706 4.481 0 6.187 0.826 0.826 1.925 1.281 3.094 1.281s2.267-0.455 3.094-1.281l6-6c1.706-1.706 1.706-4.481 0-6.187-0.635-0.635-0.635-1.663 0-2.298s1.663-0.635 2.298 0c2.973 2.973 2.973 7.81 0 10.783l-6 6c-1.44 1.44-3.355 2.233-5.392 2.233z"></path>
                        </svg>
                    </IconButton>
                </a>
            );
        }
    }

    renderYoutube() {
        if(this.state.queue[0].youtube) {
            return (
                <a href={this.state.queue[0].youtube} target="_blank">

                    <IconButton tooltip="Youtube">
                        <svg id="icon-youtube" viewBox="0 0 27 32" style={{width: 32, height:32}}>
                            <title>youtube</title>
                            <path class="path1" d="M17.339 22.214v3.768q0 1.196-0.696 1.196-0.411 0-0.804-0.393v-5.375q0.393-0.393 0.804-0.393 0.696 0 0.696 1.196zM23.375 22.232v0.821h-1.607v-0.821q0-1.214 0.804-1.214t0.804 1.214zM6.125 18.339h1.911v-1.679h-5.571v1.679h1.875v10.161h1.786v-10.161zM11.268 28.5h1.589v-8.821h-1.589v6.75q-0.536 0.75-1.018 0.75-0.321 0-0.375-0.375-0.018-0.054-0.018-0.625v-6.5h-1.589v6.982q0 0.875 0.143 1.304 0.214 0.661 1.036 0.661 0.857 0 1.821-1.089v0.964zM18.929 25.857v-3.518q0-1.304-0.161-1.768-0.304-1-1.268-1-0.893 0-1.661 0.964v-3.875h-1.589v11.839h1.589v-0.857q0.804 0.982 1.661 0.982 0.964 0 1.268-0.982 0.161-0.482 0.161-1.786zM24.964 25.679v-0.232h-1.625q0 0.911-0.036 1.089-0.125 0.643-0.714 0.643-0.821 0-0.821-1.232v-1.554h3.196v-1.839q0-1.411-0.482-2.071-0.696-0.911-1.893-0.911-1.214 0-1.911 0.911-0.5 0.661-0.5 2.071v3.089q0 1.411 0.518 2.071 0.696 0.911 1.929 0.911 1.286 0 1.929-0.946 0.321-0.482 0.375-0.964 0.036-0.161 0.036-1.036zM14.107 9.375v-3.75q0-1.232-0.768-1.232t-0.768 1.232v3.75q0 1.25 0.768 1.25t0.768-1.25zM26.946 22.786q0 4.179-0.464 6.25-0.25 1.054-1.036 1.768t-1.821 0.821q-3.286 0.375-9.911 0.375t-9.911-0.375q-1.036-0.107-1.83-0.821t-1.027-1.768q-0.464-2-0.464-6.25 0-4.179 0.464-6.25 0.25-1.054 1.036-1.768t1.839-0.839q3.268-0.357 9.893-0.357t9.911 0.357q1.036 0.125 1.83 0.839t1.027 1.768q0.464 2 0.464 6.25zM9.125 0h1.821l-2.161 7.125v4.839h-1.786v-4.839q-0.25-1.321-1.089-3.786-0.661-1.839-1.161-3.339h1.893l1.268 4.696zM15.732 5.946v3.125q0 1.446-0.5 2.107-0.661 0.911-1.893 0.911-1.196 0-1.875-0.911-0.5-0.679-0.5-2.107v-3.125q0-1.429 0.5-2.089 0.679-0.911 1.875-0.911 1.232 0 1.893 0.911 0.5 0.661 0.5 2.089zM21.714 3.054v8.911h-1.625v-0.982q-0.946 1.107-1.839 1.107-0.821 0-1.054-0.661-0.143-0.429-0.143-1.339v-7.036h1.625v6.554q0 0.589 0.018 0.625 0.054 0.393 0.375 0.393 0.482 0 1.018-0.768v-6.804h1.625z"></path>
                        </svg>
                    </IconButton>

                </a>
            );
        }
    }



    renderBack() {
        if(this.state.showAnswer) {
            return (
                <div>
                    <Paper zDepth={2} style={{marginTop: 20, paddingBottom: 40}}>
                        <div style={{paddingTop:20, paddingBottom:20, fontSize: 22, textAlign: "center"}} dangerouslySetInnerHTML={{__html: this.state.queue[0].backside}}>


                        </div>

                        <div style={{textAlign:"center"}}>
                            {this.renderLiteratura()}
                            {this.renderYoutube()}
                            {this.renderExtraLink()}
                            {this.renderWikiskripta()}
                            {this.renderWikipedia()}
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