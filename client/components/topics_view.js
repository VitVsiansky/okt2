import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { Grid, Row, Col } from 'meteor/lifefilm:react-flexbox-grid';
import {List} from 'material-ui/List';
import { Topics } from "../../imports/collections/topics";

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
            detailWidth:4,
            hideDetail: false
        });
    }

    render() {
        if (this.state.viewTopic == {}) {
            return (
                <div>
                    Loading...
                </div>
            );
        }
        return (

            <Grid  key={this.props.params.topic}>
                <Row>
                    <Col md={this.state.detailWidth} className={this.state.hideDetail ? 'hidden' : ''}>
                        <TopicDetail selectedTopic={this.state.selectedTopic}
                       />
                    </Col>
                    <Col md={this.state.listWidth}>
                        <List>
                            <TopicsList onSelect={this.onSelect.bind(this)}
                                        viewTopic={this.props.params.topic}
                            />
                        </List>
                    </Col>
                </Row>
            </Grid>

        );
    }
}

export default createContainer(() => {
    Meteor.subscribe("topics");

    return { topics: Topics.find().fetch() };
}, TopicsView);