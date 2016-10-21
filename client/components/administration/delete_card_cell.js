import React from "react";
import { TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';


class DeleteCardCell extends React.Component {
    render() {
        return (
            <TableRowColumn>
                <button id={this.props.cellData.id}
                    onClick={this.props.onCardDelete}> Odstranit </button>
            </TableRowColumn>
        );
    }
}

export default DeleteCardCell;