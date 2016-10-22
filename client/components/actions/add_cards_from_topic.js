import React, { Component } from "react";
import { Topics } from "../../../imports/collections/topics";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NoteAdd from 'material-ui/svg-icons/action/note-add';
import { createContainer } from "meteor/react-meteor-data";
import CircularProgress from 'material-ui/CircularProgress';

class AddCardsFromTopic extends TrackerReact(Component) {
    constructor(props) {
        super(props);
        this.addAllCards = this.addAllCards.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            snackbarOpen: false,
            snackbarMessage: "",
            dialogOpen: false,
            addingCards: false
        }
    }

    handleOpen() {
        this.setState({ dialogOpen: true });
    }

    handleClose() {
        this.setState({ dialogOpen: false });
    }

    closeSnackbar() {
        this.setState({
            snackbarOpen: false,
        });
    }

    addAllCards() {

        this.setState({
            dialogOpen: false
        })


        Meteor.call("update.todo.on.cards.add", this.props.remainingCards);

        //Update the user collection with card Ids
        this.props.cardsToAdd.forEach((id) => {
            Meteor.call("add.new.card.to.logs", id);
        });


        Meteor.call("add.card.ids.to.user", this.props.cardsToAdd, (error, result) => {
            if (error) {
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

    dialogContent() {
        if (this.state.addingCards) {
            return (
                <div>
                    <CircularProgress size={1} thickness={5} />
                </div>
            );
        }
        else {
            return (
                <div>
                    Chcete přidat {this.props.remainingCards} konceptů z tohoto tématu?
                    </div>
            );
        }
    }


    render() {
        if (this.props.remainingCards === 0) {
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
                    {this.dialogContent()}
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

export default createContainer((props) => {
    console.log(props);

    Meteor.subscribe("topics");
    var cardsHandle = Meteor.subscribe("users.cards");
    var loading = !cardsHandle.ready();

    if (loading) {
        return { loading }
    } else {
        var userCardsIds = Meteor.users.find(Accounts.userId(), { fields: { activeCards: 1 } }).fetch()[0].activeCards;

        //Iterate over all topics children and fetch their cards
        var fetchedCards = [];
        var stack = [];
        var item = props.selectedTopic;
        stack.push(item);
        while (stack.length > 0) {
            var currentnode = stack.pop();
            var children = Topics.find({ _id: { $in: currentnode.children } });
            children.forEach((child) => {
                if (child.cards) {
                    fetchedCards.push(child.cards);
                }
                if (child.children.length > 0) {
                    stack.push(child);
                }
            });
        }

        //Merge the arrays of cards
        fetchedCards.push(props.selectedTopic.cards);
        fetchedCards = [].concat.apply([], fetchedCards);

        var cardsIds = fetchedCards.map(function (a) { return a._id; });

        //Determine which cards should be added based on current users active cards

        var cardsToAdd = cardsIds.filter(function (n) {
            if (userCardsIds == undefined) {
                return 0;
            }
            return userCardsIds.indexOf(n) == -1;
        });





        var topicCardsIds = fetchedCards.map(function (a) { return a._id; });


        var cardsIntersection = topicCardsIds.filter(function (n) {
            if (userCardsIds == undefined) {
                return 0;
            }
            return userCardsIds.indexOf(n) != -1;
        });

        var remainingCards = topicCardsIds.length - cardsIntersection.length;

        return { loading, cardsToAdd, remainingCards }


    }

}, AddCardsFromTopic);