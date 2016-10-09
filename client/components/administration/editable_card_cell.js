import React from "react";
import {TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';

class EditableCardCell extends React.Component {
    render() {
        return (
            <TableRowColumn>
                <textarea name={this.props.cellData.type} defaultValue={this.props.cellData.value} id={this.props.cellData.id}
                onChange={this.props.onCardTableUpdate}
                rows={8}/>
            </TableRowColumn>
        );
    }
}

export default EditableCardCell;