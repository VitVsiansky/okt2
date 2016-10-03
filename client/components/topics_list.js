import React, { Component } from "react";
import {List, ListItem} from 'material-ui/List';
import { createContainer } from "meteor/react-meteor-data";

import { Topics } from "../../imports/collections/topics";

class TopicsList extends Component {
    setSelectedTopic(topic) {
        this.props.onSelect(topic);
    }

    getAllChildren(children) {
        var fetchedChildren = Topics.find({ _id: { $in: children}}).fetch();

        return fetchedChildren.map(child =>
            <ListItem key={child._id}
                      primaryText={child.name}
                      nestedItems={this.getAllChildren(child.children)}
                      onClick={() => this.setSelectedTopic(child)}>
            </ListItem>);
    }

    render() {

        return (
            <div>
                    {Topics.find({name:"anatomie"}).map(topic =>
                    <ListItem key={topic._id}
                              primaryText={topic.name}
                              nestedItems={this.getAllChildren(topic.children)}
                              onClick={() => this.setSelectedTopic(topic)}>
                    </ListItem>
                    )}
            </div>
        );
    }
}

export default createContainer(() => {
    Meteor.subscribe("topics");

    return { topics: Topics.find().fetch() };
}, TopicsList);