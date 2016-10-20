import React, { Component } from "react";
import {ListItem, List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { createContainer } from "meteor/react-meteor-data";

import { Topics } from "../../imports/collections/topics";

class TopicsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTopics: []
        }
    }

    setSelectedTopic(topic) {
        this.props.onSelect(topic);
    }

    getAllChildren(children) {
        var fetchedChildren = Topics.find({ _id: { $in: children}}).fetch();

        return fetchedChildren.map(child =>
            <ListItem key={child._id}
                      primaryText={child.name}
                      nestedItems={this.getAllChildren(child.children)}
                      onClick={() => this.setSelectedTopic(child)}
                      primaryTogglesNestedList={true}
                      >
                      
            </ListItem>);
    }

    renderList() {
        Meteor.subscribe("topics", () => {
            var topics = Topics.find({name:this.props.viewTopic}).fetch();
            if(topics[0].children) {
                var children = this.getAllChildren(topics[0].children);
            }

            this.setState({
                selectedTopics: children
            })
        });
    }

    componentWillMount() {
        this.renderList()
    }

    render() {
        return (
            <List>

                {this.state.selectedTopics}

            </List>
        );
    }
}

export default createContainer(() => {
    Meteor.subscribe("topics");

    return { topics: Topics.find().fetch() };
}, TopicsList);