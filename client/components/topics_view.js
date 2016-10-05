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
            selectedTopic: ""
        }
    }

    onSelect(topic) {
        this.setState({
            selectedTopic: topic
        });
    }

    render() {
        return (

            <Grid>
                <Row>
                    <Col md={4}>
                        <TopicDetail selectedTopic={this.state.selectedTopic}/>
                    </Col>
                    <Col md={8}>
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