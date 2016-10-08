import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { Topics } from "../../../imports/collections/topics";
import TopicsTable from "./topics_table";
import TextField from 'material-ui/TextField';
import {orange500, blue500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

const styles = {
    errorStyle: {
        color: orange500,
    },
    underlineStyle: {
        borderColor: orange500,
    },
    floatingLabelStyle: {
        color: orange500,
    },
    floatingLabelFocusStyle: {
        color: blue500,
    },
};

var AddTopic = React.createClass({
    getInitialState:function(){
        return {
            password: "",
            name:'',
            parentId:"",
            textbook:"",
            textbookDetails:"",
            sampleImage:"",
            snackbarOpen: false,
            snackbarMessage: ""
        }
    },

    nameChange: function (evt) {
        this.setState({ name: evt.target.value });
    },

    parentIdChange: function (evt) {
        this.setState({ parentId: evt.target.value });
    },

    textbookChange: function (evt) {
        this.setState({ textbook: evt.target.value });
    },

    textbookDetailsChange: function (evt) {
        this.setState({ textbookDetails: evt.target.value });
    },

    sampleImageChange: function (evt) {
        this.setState({ sampleImage: evt.target.value });
    },

    submitTopic: function () {
        var checkId = Topics.find({_id: this.state.parentId}).fetch();

        if (checkId == 0) {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Nadřazené téma nenalezeno. Zkontrolujte ID"
            });
            return;
        }
        if (!this.state.name) {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Musíte zadat nějaký název"
            });
            return;
        }

        Meteor.call("add.topic", this.state.name, this.state.parentId,
            this.state.textbook, this.state.textbookDetails, this.state.sampleImage,
            (error, result) => {
                this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Téma přidáno",
                    name:'',
                    parentId:"",
                    textbook:"",
                    textbookDetails:"",
                    sampleImage:""
                });
        })
    },

    closeSnackbar: function () {
        this.setState({
            snackbarOpen: false,
        });
    },

    checkPassword(evt) {
        this.setState({
            password: evt.target.value
        });
    },


    render: function () {

        if(this.state.password != "pagoda55") {
            return (
                <div>
                    Heslo:<br />
                    <input type="text" defaultValue="" onChange={this.checkPassword.bind(this)}/>
                </div>
            );
        }

        return (
            <div className="Aligner">
                <div>
                    <div  style={{marginLeft:"25%"}}>
                    <TextField
                        floatingLabelText="Název tématu"
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        onChange={this.nameChange}
                        value={this.state.name}

                    />
                    <br />
                    <TextField
                        floatingLabelText="ID nadřazeného tématu"
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        onChange={this.parentIdChange}
                        value={this.state.parentId}
                    />
                    <br />
                    <TextField
                        floatingLabelText="Název učebnice"
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        onChange={this.textbookChange}
                        value={this.state.textbook}
                    />
                    <br />
                    <TextField
                        floatingLabelText="Strany a kapitola učebnice"
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        multiLine={true}
                        rows={2}
                        rowsMax={4}
                        onChange={this.textbookDetailsChange}
                        value={this.state.textbookDetails}
                    />
                    <br />
                    <TextField
                        floatingLabelText="Příklad obrázek"
                        floatingLabelStyle={styles.floatingLabelStyle}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        onChange={this.sampleImageChange}
                        value={this.state.sampleImage}
                    />
                    <br />

                    <img src={this.state.sampleImage} />
                    <br />
                    <RaisedButton label="Přidat téma" primary={true} style={{marginTop: "8%"}}
                                 onClick={this.submitTopic}/>
                        </div>


                    <TopicsTable topics={this.props.topics} />

                </div>

                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={8000}
                    onRequestClose={this.closeSnackbar}
                />
            </div>

        );

    }
});


export default createContainer(() => {
    Meteor.subscribe("topics");

    return { topics: Topics.find().fetch() };
}, AddTopic);