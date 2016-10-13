import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class TopicsTable extends Component {
    render() {
        return(
          <Table>
              <TableHeader displaySelectAll={false}
                           adjustForCheckbox={false}>
                  <TableRow>
                      <TableHeaderColumn>ID</TableHeaderColumn>
                      <TableHeaderColumn>Název</TableHeaderColumn>
                  </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                  {this.props.topics.map(topic =>
                      <TableRow key={topic._id}>
                          <TableRowColumn>{topic._id}</TableRowColumn>
                          <TableRowColumn>{topic.name}</TableRowColumn>
                      </TableRow>
                  )}
              </TableBody>
          </Table>
        );
    }
}

export default TopicsTable;