import React, { Component } from "react";
import { CardLogs } from "../../../imports/collections/cardlogs";
import { ToDo } from "../../../imports/collections/todo";
import _ from "lodash";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import LinearProgress from 'material-ui/LinearProgress';

class TodayToDo extends TrackerReact(Component) {
/*    

    countCardsDoneToday() {
        Meteor.subscribe("users.card.logs", () => {
            var logs = CardLogs.find({}).fetch();

            logs = _.filter(logs, {history: [{reviewedAt: moment().endOf("day").toDate()}]});
            var cardsDoneToday = logs.length;
            this.setState({
                cardsDoneToday: cardsDoneToday
            });

        });
    }

    countCardsToDo() {
        Meteor.subscribe("users.today.todo", () => {
            var cardsToDo = ToDo.find({}).fetch()[0].count;
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
    }*/

    constructor(props) {
        super(props);
        this.state = {
            queueLength: 0,
            cardsToDoToday: 0
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            queueLength: props.queueLength,
            cardsToDoToday: props.cardsToDoToday
        });

    }

    render() {

        return (
            <div>
                <LinearProgress style={{height:5}} mode="determinate"
                 value={Math.round(((this.props.cardsToDoToday - this.props.queueLength)/this.props.cardsToDoToday)*100)} />
            </div>
        );
    }
}

export default TodayToDo;
