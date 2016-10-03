import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { Topics } from "../../../imports/collections/topics";
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class TopicCardsTable extends TrackerReact(React.Component) {
    getTopicCards() {
        Meteor.subscribe("topics");
        var topicObject = Topics.findOne({_id:this.props.topic});
        if (topicObject) {
            var cards = topicObject.cards;
            var sorted = cards.sort(function(a,b){
                return new Date(b.dateCreated) - new Date(a.dateCreated);
            });
            return sorted;
        } else {
            return [];
        }
    }

    render() {
        return(
            <Table>
                <TableHeader displaySelectAll={false}
                             adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Otázka</TableHeaderColumn>
                        <TableHeaderColumn>Odpověď</TableHeaderColumn>
                        <TableHeaderColumn>img</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {this.getTopicCards().map(card =>
                        <TableRow key={card._id}>
                            <TableRowColumn>{card.frontside}</TableRowColumn>
                            <TableRowColumn>{card.backside}</TableRowColumn>
                            <TableRowColumn><img src={card.image} style={{maxHeight:200, maxWidth:200}}/></TableRowColumn>
                        </TableRow>
                    )}
                </TableBody>

            </Table>
        );
    }
}
export default TopicCardsTable;