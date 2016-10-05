import React, {Component} from "react";
import { Topics } from "../../../imports/collections/topics";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Visibility from 'material-ui/svg-icons/action/visibility';
import {pink600} from 'material-ui/styles/colors';

class ShowCardsFromTopic extends TrackerReact(Component) {
    constructor(props) {
        super(props);
        this.getCards = this.getCards.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);

        this.state = {
            dialogOpen: false,
        }
    }

    handleDialogOpen()  {
        this.setState({dialogOpen: true});
    }

    handleDialogClose() {
        this.setState({dialogOpen: false});
    }

    getCards() {
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

        if(!fetchedCards) {
            return [];
        } else {
            return fetchedCards;
        }

    }

    render() {
        var cards = this.getCards();
        if(!cards) {
            cards = [];
        }

        return (
            <div>
                <RaisedButton label="Zobrazit koncepty"
                              onTouchTap={this.handleDialogOpen}
                              fullWidth={true}
                              labelPosition="before"
                              icon={<Visibility />}
                              backgroundColor={pink600}
                />
                <Dialog
                    title={this.props.selectedTopic.name}
                    actions={[
                        <FlatButton
                            label="Zavřít"
                            primary={true}
                            onTouchTap={this.handleDialogClose}
                        />
                    ]}
                    modal={false}
                    autoScrollBodyContent={true}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    <Table>
                        <TableHeader displaySelectAll={false}
                                     adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Otázka</TableHeaderColumn>
                                <TableHeaderColumn>Odpověď</TableHeaderColumn>
                                <TableHeaderColumn>Obrázek</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {cards.map(card =>
                                <TableRow key={card._id}>
                                    <TableRowColumn>{card.frontside}</TableRowColumn>
                                    <TableRowColumn>{card.backside}</TableRowColumn>
                                    <TableRowColumn><img src={card.image} style={{maxHeight:200, maxWidth:200}}/></TableRowColumn>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Dialog>

            </div>
        );
    }
}

export default ShowCardsFromTopic;