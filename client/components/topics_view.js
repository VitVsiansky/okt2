import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createContainer } from "meteor/react-meteor-data";
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

            <div>
                <div style={{ display: "flex"}}>
                    <div style={{width: "30%"}}>
                        <TopicDetail selectedTopic={this.state.selectedTopic}/>
                    </div>
                    <div style={{width: "70%", margin: "3%"}}>
                        <List>
                            <TopicsList onSelect={this.onSelect.bind(this)}/>
                        </List>
                    </div>
                </div>
            </div>

        );
    }
}

export default createContainer(() => {
    Meteor.subscribe("topics");

    return { topics: Topics.find().fetch() };
}, TopicsView);