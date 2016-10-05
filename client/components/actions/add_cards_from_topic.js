import React, {Component} from "react";
import { Topics } from "../../../imports/collections/topics";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NoteAdd from 'material-ui/svg-icons/action/note-add';

class AddCardsFromTopic extends TrackerReact(Component) {
    constructor(props) {
        super(props);
        this.addAllCards = this.addAllCards.bind(this);
        this.countRemainingCards = this.countRemainingCards.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            snackbarOpen: false,
            snackbarMessage: "",
            dialogOpen: false
        }
    }

    handleOpen() {
        this.setState({dialogOpen: true});
    }

    handleClose() {
        this.setState({dialogOpen: false});
    }

    closeSnackbar() {
        this.setState({
            snackbarOpen: false,
        });
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


        var cardsIntersection = topicCardsIds.filter(function(n) {
            if(userCardsIds == undefined) {
                return 0;
            }
            return userCardsIds.indexOf(n) != -1;
        });





        return topicCardsIds.length - cardsIntersection.length;


    }

    addAllCards() {
        Meteor.subscribe("topics");

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


        var cardsIds = fetchedCards.map(function(a) {return a._id;});

        cardsIds.forEach((id) => {
            Meteor.call("add.new.card.to.logs", id);
        });


        //Update today to do
        var userCardsIds = Meteor.users.find(Accounts.userId(), {fields: {activeCards:1}}).fetch()[0].activeCards;


        var cardsIntersection = cardsIds.filter(function(n) {
            if(userCardsIds == undefined) {
                return 0;
            }
            return userCardsIds.indexOf(n) != -1;
        });

        Meteor.call("update.todo.on.cards.add", cardsIds.length - cardsIntersection.length);

        //Update the user collection with card Ids
        Meteor.call("add.card.ids.to.user", cardsIds, (error, result) => {
            if(error) {
                console.log(error);
            } else {
                this.setState({
                    dialogOpen: false,
                    snackbarOpen: true,
                    snackbarMessage: "Koncepty přidány"
                })
            }

        });

    }


    render() {
        Meteor.subscribe('users.cards');
        var remainingCards = this.countRemainingCards();
        if (remainingCards === 0) {
            var disableAddTopic = true;
        } else {
            var disableAddTopic = false;
        }

        const actions = [
            <FlatButton
                label="Zrušit"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Přidat"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.addAllCards}
            />,
        ];

        return (
            <div>
                <RaisedButton onClick={this.handleOpen}
                              label="Přidat koncepty"
                              primary={true}
                              icon={<NoteAdd />}
                              fullWidth={true}
                              labelPosition="before"
                              disabled={disableAddTopic}
                />
                <Dialog
                    title="Přidat koncepty"
                    actions={actions}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleClose}
                >
                    Chcete přidat {remainingCards} konceptů z tohoto tématu?
                </Dialog>
                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={5000}
                    onRequestClose={this.closeSnackbar}
                />
            </div>
        );
    }
}

export default AddCardsFromTopic;