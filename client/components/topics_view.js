import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import { List } from 'material-ui/List';
import { Topics } from "../../imports/collections/topics";

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

import TopicsList from "./topics_list";
import TopicDetail from "./topic_detail";

class TopicsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTopic: "",
            listWidth: 12,
            detailWidth: 0,
            hideDetail: true,
        }
    }

    onSelect(topic) {
        this.setState({
            selectedTopic: topic,
            listWidth: 8,
            detailWidth: 4,
            hideDetail: false
        });
    }

    render() {
        console.log(this.state.selectedTopic);
        if (this.state.viewTopic == {}) {
            return (
                <div>
                    Loading...
                </div>
            );
        }

        if (!this.state.selectedTopic) {
            return (
                <ReactCSSTransitionGroup
                    transitionName="example"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    <div key={this.props.params.topic}>
                        <div className="row">
                            <div>
                                <TopicDetail isTopicSelected={false} />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15">
                                <TopicsList onSelect={this.onSelect.bind(this)}
                                    viewTopic={this.props.params.topic}
                                    />
                            </div>

                        </div>
                    </div>
                </ReactCSSTransitionGroup>
            );
        }


        return (
            <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                <div key={this.props.params.topic}>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15">
                            <TopicDetail
                                selectedTopic={this.state.selectedTopic}
                                isTopicSelected={true}
                                />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 m-b-15">
                            <TopicsList onSelect={this.onSelect.bind(this)}
                                viewTopic={this.props.params.topic}
                                />
                        </div>

                    </div>
                </div>
            </ReactCSSTransitionGroup>

        );
    }
}

export default createContainer(() => {
    Meteor.subscribe("topics");

    return { topics: Topics.find().fetch() };
}, TopicsView);