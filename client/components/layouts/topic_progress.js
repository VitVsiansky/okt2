import React, {Component} from "react";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Topics } from "../../../imports/collections/topics";
import LinearProgress from 'material-ui/LinearProgress';

class TopicProgress extends TrackerReact(Component) {
    constructor(props) {
        super(props);
        this.countRemainingCards = this.countRemainingCards.bind(this);

    }

    countRemainingCards() {
        Meteor.subscribe("topics");
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

        console.log(userCardsIds);

        var cardsIntersection = topicCardsIds.filter(function(n) {
            if(userCardsIds == undefined) {
                console.log("returning");
                return 0;
            }
            return userCardsIds.indexOf(n) != -1;
        });

        console.log(topicCardsIds.length - cardsIntersection.length);
        console.log(topicCardsIds.length);
        console.log(cardsIntersection.length);




        return {
            userCardCount:  cardsIntersection.length,
            topicCardCount: topicCardsIds.length
        };


    }

    render() {
        var remainingCards = this.countRemainingCards();
        return (
            <div>
                <div style={{textAlign:"center"}}>
                {remainingCards.userCardCount} / {remainingCards.topicCardCount} konceptů přidáno
                </div>
                <br />
                <LinearProgress style={{height:10}} mode="determinate" value={(remainingCards.userCardCount/remainingCards.topicCardCount)*100} />
            </div>
        );
    }
}

export default TopicProgress;