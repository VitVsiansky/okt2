import React from "react";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import InfoBox from "./infobox";
import { cyan600, purple600, orange600 } from 'material-ui/styles/colors';
import Update from 'material-ui/svg-icons/action/update';
import Timeline from 'material-ui/svg-icons/action/timeline';
import School from 'material-ui/svg-icons/social/school';
import _ from "lodash";
import NewsList from "./news_list";
import AnswerTypesGraph from "./answer_types_graph";
import { createContainer } from "meteor/react-meteor-data";
import CircularProgress from 'material-ui/CircularProgress';

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

import { CardLogs } from "../../../imports/collections/cardlogs";
import { ToDo } from "../../../imports/collections/todo";
import { News } from "../../../imports/collections/news"

class Dashboard extends TrackerReact(React.Component) {

    render() {

        if (this.props.loading) {
            return (
                <div>
                    <CircularProgress size={1} thickness={5} />
                </div>
            );
        }
        return (
            <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                <div>
                    <div className="row">

                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15 ">
                            <InfoBox Icon={Update}
                                color={cyan600}
                                title="Dnes k opakování"
                                value={this.props.queue.length}
                                />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15 ">
                            <InfoBox Icon={Timeline}
                                color={orange600}
                                title="Celkem opakování"
                                value={this.props.totalReps}
                                />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15 ">
                            <InfoBox Icon={School}
                                color={purple600}
                                title="Dnů studováno"
                                value={this.props.daysStudied}
                                />
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: 25 }}>

                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
                            <NewsList news={this.props.news} />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
                            <AnswerTypesGraph data={this.props.answerTypesGraphData} />
                        </div>
                    </div>




                </div>
            </ReactCSSTransitionGroup>
        );
    }
}

export default createContainer(({ }) => {
    Meteor.subscribe("users.all.todo");
    Meteor.subscribe("all.news");
    const logsHandle = Meteor.subscribe("users.card.logs");
    const loading = !logsHandle.ready();

    var logs = CardLogs.find({});
    var totalReps = 0;
    logs.forEach((log) => {
        if (log.history) {
            totalReps += log.history.length;
        }
    });

    var againCount = 0;
            var hardCount = 0;
            var goodCount = 0;
            var easyCount = 0;
            logs.forEach((log) => {
                if (log.againCount) {
                    againCount = againCount + log.againCount;
                }
                if (log.hardCount) {
                    hardCount += log.hardCount;
                }

                if (log.goodCount) {
                    goodCount += log.goodCount;
                }

                if (log.easyCount) {
                    easyCount += log.easyCount;
                }
            });

                            var answerTypesGraphData = {
                    labels: [
                        "Znovu",
                        "Těžké",
                        "Správně",
                        "Snadné"
                    ],
                    datasets: [
                        {
                            data: [againCount, hardCount, goodCount, easyCount],
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

    var daysStudied = ToDo.find({}).count();

     var news = News.find({}).fetch();

    return { loading, totalReps, daysStudied, news, answerTypesGraphData };
}, Dashboard);