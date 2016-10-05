import React, { Component } from "react";
import { CardLogs } from "../../../imports/collections/cardlogs";
import { ToDo } from "../../../imports/collections/todo";
import _ from "lodash";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import LinearProgress from 'material-ui/LinearProgress';

class TodayToDo extends TrackerReact(React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            cardsDoneToday: 0,
            cardsToDo: 0
        };
    }

    countCardsDoneToday() {
        Meteor.subscribe("users.card.logs", () => {
            var logs = CardLogs.find({}).fetch();

            logs = _.filter(logs, {history: [{reviewedAt: moment().endOf("day").toDate()}]});
            var cardsDoneToday = logs.length;
            console.log(cardsDoneToday);
            this.setState({
                cardsDoneToday: cardsDoneToday
            });

        });
    }

    countCardsToDo() {
        Meteor.subscribe("users.today.todo", () => {
            console.log(ToDo.find({}).fetch());
            var cardsToDo = ToDo.find({}).fetch()[0].count;
            console.log("to do" + cardsToDo);
            this.setState({
                cardsToDo: cardsToDo
            });
        });
    }

    listenToAnswer() {
        Meteor.subscribe("users.card.logs", () => {
            CardLogs.find({}).observe({changed: () => {
                this.countCardsDoneToday();
            }});
        });

    }

    componentDidMount() {
        {this.countCardsDoneToday()}
        {this.countCardsToDo()}
        {this.listenToAnswer()}
    }

    componentWillMount() {
        {this.countCardsDoneToday()}
        {this.countCardsToDo()}
        {this.listenToAnswer()}
    }

    render() {
        return (
            <div>
                <LinearProgress style={{height:5}} mode="determinate" value={Math.round((this.state.cardsDoneToday/this.state.cardsToDo)*100)} />
            </div>
        );
    }
}

export default TodayToDo;
