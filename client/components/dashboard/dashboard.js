import React from "react";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import InfoBox from "./infobox";
import {cyan600, purple600, orange600} from 'material-ui/styles/colors';
import Update from 'material-ui/svg-icons/action/update';
import Timeline from 'material-ui/svg-icons/action/timeline';
import School from 'material-ui/svg-icons/social/school';
import _ from "lodash";
import NewsList from "./news_list";
import AnswerTypesGraph from "./answer_types_graph";

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

import { CardLogs } from "../../../imports/collections/cardlogs";
import { ToDo } from "../../../imports/collections/todo";
import { News } from "../../../imports/collections/news"

class Dashboard extends TrackerReact(React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            cardsDoneToday: 0,
            cardsToDo: 0,
            totalReps: 0,
            daysStudied: 0,
            news: [],
            answerTypesGraphData: {}
        };
    }

    countCardsToDo() {
        Meteor.subscribe("users.today.todo", () => {
            var cardsToDo = ToDo.find({}).fetch()[0].count;
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

    getNews() {
        Meteor.subscribe("all.news", () => {
            var news = News.find({});
            this.setState({
                news: news
            })
        })
    }

    countAnswerTypes() {

    }

    generateAnswerTypesGraphData() {

        Meteor.subscribe("users.card.logs", () => {
            var logs = CardLogs.find({});
            var againCount = 0;
            var hardCount = 0;
            var goodCount = 0;
            var easyCount = 0;
            logs.forEach((log) => {
                if(log.againCount) {
                    againCount = againCount + log.againCount;
                }
                if(log.hardCount) {
                    hardCount += log.hardCount;
                }

                if(log.goodCount) {
                    goodCount += log.goodCount;
                }

                if(log.easyCount) {
                    easyCount += log.easyCount;
                }
            });

            this.setState({
                againCount: againCount,
                hardCount: hardCount,
                goodCount: goodCount,
                easyCount: easyCount
            });


            this.setState({
                answerTypesGraphData: {
                    labels: [
                        "Znovu",
                        "Těžké",
                        "Správně",
                        "Snadné"
                    ],
                    datasets: [
                        {
                            data: [this.state.againCount, this.state.hardCount, this.state.goodCount, this.state.easyCount],
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#F7AE96"
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#F7AE96"
                            ]
                        }]
                }
            });

        })


    }

    componentDidMount() {
        {this.countCardsDoneToday()}
        {this.countCardsToDo()}
        {this.countTotalCardsDone()}
        {this.countDaysStudied()}
        {this.getNews()}
        {this.countAnswerTypes()}
        {this.generateAnswerTypesGraphData()}
    }


    render() {
        {this.countCardsDoneToday()}
        {this.countCardsToDo()}
        {this.countTotalCardsDone()}
        {this.countDaysStudied()}
        {this.getNews()}
        {this.countAnswerTypes()}
        {this.generateAnswerTypesGraphData()}
        return (
        <ReactCSSTransitionGroup
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={500}>

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
                <Row style={{marginTop: 25}}>
                    <Col md={6}>
                        <NewsList news={this.state.news}/>
                    </Col>
                    <Col md={6}>
                        <AnswerTypesGraph data={this.state.answerTypesGraphData}/>
                    </Col>
                </Row>
            </Grid>
        </ReactCSSTransitionGroup>
        );
    }
}

export default Dashboard;