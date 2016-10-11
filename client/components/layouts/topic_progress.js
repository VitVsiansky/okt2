import React, {Component} from "react";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Topics } from "../../../imports/collections/topics";
import LinearProgress from 'material-ui/LinearProgress';
import { createContainer } from "meteor/react-meteor-data";

class TopicProgress extends TrackerReact(Component) {
    constructor(props) {
        super(props);
        this.countRemainingCards = this.countRemainingCards.bind(this);

    }

    countRemainingCards() {
      /*  Meteor.subscribe("topics");
        if(!this.props.selectedTopic) {
            return "";
        }

        //Iterate over all topics children and fetch their cards
        var fetchedCards=[];
        var stack=[];
        var item = this.props.selectedTopic;
        stack.push(item);
        while (stack.length>0){
            var currentnode = stack.pop();
            var children = Topics.find({_id:{$in:currentnode.children}});
            children.forEach((child) => {
                if(child.cards){
                    fetchedCards.push(child.cards);
                }
                if(child.children.length>0){
                    stack.push(child);
                }
            });
        }

        //Merge the arrays of cards
        fetchedCards.push(this.props.selectedTopic.cards);
        fetchedCards = [].concat.apply([], fetchedCards);

        var topicCardsIds = fetchedCards.map(function(a) {return a._id;});
        var userCardsIds = Meteor.users.find(Accounts.userId(), {fields: {activeCards:1}}).fetch()[0].activeCards;



        var cardsIntersection = topicCardsIds.filter(function(n) {
            if(userCardsIds == undefined) {
                console.log("returning");
                return 1000;
            }
            return userCardsIds.indexOf(n) != -1;
        });






        return {
            userCardCount:  cardsIntersection.length,
            topicCardCount: topicCardsIds.length
        };

*/
    }

    render() {
/*        var remainingCards = this.countRemainingCards();*/
if (this.props.loading) {
    return (
        <div>
            Loading
        </div>
    );
}
        return (
            <div>
                <div style={{textAlign:"center"}}>
                {this.props.userCardCount} / {this.props.topicCardCount} konceptů přidáno
                </div>
                <br />
                <LinearProgress style={{height:10}} mode="determinate" value={(this.props.userCardCount/this.props.topicCardCount)*100} />
            </div>
        );
    }
}

export default createContainer(({ selectedTopic }) => {
    Meteor.subscribe("topics");
    Meteor.subscribe("user");
    const usersHandle = Meteor.subscribe("user");
    const loading = !usersHandle.ready();

    if(!loading) {
        //Iterate over all topics children and fetch their cards
        var fetchedCards=[];
        var stack=[];
        var item = selectedTopic;
        stack.push(item);
        while (stack.length>0){
            var currentnode = stack.pop();
            var children = Topics.find({_id:{$in:currentnode.children}});
            children.forEach((child) => {
                if(child.cards){
                    fetchedCards.push(child.cards);
                }
                if(child.children.length>0){
                    stack.push(child);
                }
            });
        }

        //Merge the arrays of cards
        fetchedCards.push(selectedTopic.cards);
        fetchedCards = [].concat.apply([], fetchedCards);

        var topicCardsIds = fetchedCards.map(function(a) {return a._id;});
        var userCardsIds = Meteor.users.find(Accounts.userId(), {fields: {activeCards:1}}).fetch()[0].activeCards;

        var cardsIntersection = topicCardsIds.filter(function(n) {
            if(userCardsIds == undefined) {
                console.log("returning");
                return 1000;
            }
            return userCardsIds.indexOf(n) != -1;
        });

        var userCardCount = cardsIntersection.length;
        var topicCardCount = topicCardsIds.length;



        return { loading, selectedTopic, userCardCount, topicCardCount };
    }
    else {
        return { loading }
    }

}, TopicProgress);
