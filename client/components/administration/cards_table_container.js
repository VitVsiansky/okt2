import React from "react";
import { Topics } from "../../../imports/collections/topics";
import { createContainer } from "meteor/react-meteor-data";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import CardTableRow from "./card_table_row";

class CardsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            topic:props.topic
        }
    }

    handleCardValueChange(evt) {
        var cardValue = {
            _id: evt.target.id,
            name: evt.target.name,
            value: evt.target.value
        };

        var topic = this.state.topic;

        var newCards = topic[0].cards.map((card) => {
            for (var key in card) {
                if (key == cardValue.name && card._id == cardValue._id) {
                    card[key] = cardValue.value;
                }
            }

            return card;
        });

        console.log(newCards);

        topic[0].cards = newCards;

        this.setState({
            topic: topic
        });

        console.log(this.state.topic);

        //Call an update method with this.state.topic
Meteor.call("update.topic", this.state.topic);

    }

    componentWillReceiveProps(props) {
        this.setState({
            topic: props.topic
        });
    }

    render () {
        if(this.props.loading) {
            return (
                <div>
                    Nahrávání
                </div>
            );
        }

        if(this.props.topic.length<1) {
            return (
                <div>
                    Vyberte téma
                </div>
            );
        }

        var cards = this.state.topic[0].cards.map((card) => {
            return (
                <CardTableRow card={card} onCardTableUpdate={this.handleCardValueChange.bind(this)} />
            );
        });

        return (
            <Table>
                <TableHeader displaySelectAll={false}
                             adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Otázka</TableHeaderColumn>
                        <TableHeaderColumn>Odpověď</TableHeaderColumn>
                        <TableHeaderColumn>Adresa obrázku</TableHeaderColumn>
                        <TableHeaderColumn>Obrázek</TableHeaderColumn>
                        <TableHeaderColumn>Tag</TableHeaderColumn>
                        <TableHeaderColumn>Literatura</TableHeaderColumn>
                        <TableHeaderColumn>Wikipedia</TableHeaderColumn>
                        <TableHeaderColumn>Wikiskripta</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {cards}
                </TableBody>

            </Table>
        );
    }
}

export default createContainer(({ topicId }) => {
    const topicHandle = Meteor.subscribe("topics");
    const loading = !topicHandle.ready();
    const topic = Topics.find({_id:topicId}).fetch();
    return { loading, topic };
}, CardsTable);

