import React from "react";
import {TableRow, TableRowColumn} from 'material-ui/Table';
import EditableCardCell from "./editable_card_cell";

class CardTableRow extends React.Component {
    render() {
        return (
            <TableRow key={this.props.card._id}>
                <EditableCardCell cellData={{
                    type: "frontside",
                    value: this.props.card.frontside,
                    id: this.props.card._id
                }}
                                  onCardTableUpdate={this.props.onCardTableUpdate}
                />
                <EditableCardCell cellData={{
                    type: "backside",
                    value: this.props.card.backside,
                    id: this.props.card._id
                }}
                                  onCardTableUpdate={this.props.onCardTableUpdate}
                />
                <EditableCardCell cellData={{
                    type: "image",
                    value: this.props.card.image,
                    id: this.props.card._id
                }}
                                  onCardTableUpdate={this.props.onCardTableUpdate}
                />
                <TableRowColumn><img src={this.props.card.image} style={{maxHeight:200, maxWidth:200}}/></TableRowColumn>
                <EditableCardCell cellData={{
                    type: "tag",
                    value: this.props.card.tag,
                    id: this.props.card._id
                }}
                                  onCardTableUpdate={this.props.onCardTableUpdate}
                />
                <EditableCardCell cellData={{
                    type: "literature",
                    value: this.props.card.literature,
                    id: this.props.card._id
                }}
                                  onCardTableUpdate={this.props.onCardTableUpdate}
                />
                <EditableCardCell cellData={{
                    type: "wikipedia",
                    value: this.props.card.wikipedia,
                    id: this.props.card._id
                }}
                                  onCardTableUpdate={this.props.onCardTableUpdate}
                />
                <EditableCardCell cellData={{
                    type: "wikiskripta",
                    value: this.props.card.wikiskripta,
                    id: this.props.card._id
                }}
                                  onCardTableUpdate={this.props.onCardTableUpdate}
                />
            </TableRow>
        );
    }
}

export default CardTableRow;