import React from "react";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import InfoBox from "./infobox";
import {cyan600, purple600, orange600} from 'material-ui/styles/colors';
import Update from 'material-ui/svg-icons/action/update';
import Timeline from 'material-ui/svg-icons/action/timeline';
import School from 'material-ui/svg-icons/social/school';
import _ from "lodash";

import { CardLogs } from "../../../imports/collections/cardlogs";
import { ToDo } from "../../../imports/collections/todo";

class Dashboard extends TrackerReact(React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            cardsDoneToday: 0,
            cardsToDo: 0,
            totalReps: 0,
            daysStudied: 0
        };
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

    countTotalCardsDone() {
        Meteor.subscribe("users.card.logs", () => {
            var logs = CardLogs.find({});
            var totalReps = 0;
            logs.forEach((log) => {
                if(log.history) {
                    totalReps += log.history.length;
                }
            });
            this.setState({
                totalReps: totalReps
            });
        })
    }

    countDaysStudied() {
        Meteor.subscribe("users.all.todo", () => {
            var daysStudied = ToDo.find({}).count();
            this.setState({
                daysStudied: daysStudied
            });
        })
    }

    componentDidMount() {
        {this.countCardsDoneToday()}
        {this.countCardsToDo()}
        {this.countTotalCardsDone()}
        {this.countDaysStudied()}
    }


    render() {
        {this.countCardsDoneToday()}
        {this.countCardsToDo()}
        {this.countTotalCardsDone()}
        {this.countDaysStudied()}
        return (
            <Grid>
                <Row>
                    <Col xs={6} md={4}>
                        <InfoBox Icon={Update}
                                 color={cyan600}
                                 title="Dnes k opakování"
                                 value={this.state.cardsToDo-this.state.cardsDoneToday}
                        />
                    </Col>
                    <Col xs={6} md={4}>
                        <InfoBox Icon={Timeline}
                                 color={orange600}
                                 title="Celkem opakování"
                                 value={this.state.totalReps}
                        />
                    </Col>
                    <Col xs={6} md={4}>
                        <InfoBox Icon={School}
                                 color={purple600}
                                 title="Dnů studováno"
                                 value={this.state.daysStudied}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default Dashboard;