import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {grey400} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Topics } from "../../../imports/collections/topics";
import Snackbar from 'material-ui/Snackbar';
import 'react-codemirror/node_modules/codemirror/mode/markdown/markdown';
import TopicCardsTable from "./topic_cards_table";
import Dropzone from 'react-dropzone';
import CardsTable from "./cards_table_container";


const styles = {
    toggleDiv: {
        maxWidth: 300,
        marginTop: 40,
        marginBottom: 5
    },
    toggleLabel: {
        color: grey400,
        fontWeight: 100
    },
    buttons: {
        marginTop: 30,
        float: 'right'
    },
    saveButton: {
        marginLeft: 5
    }
};

var AddCard = React.createClass({

    getInitialState:function(){
        return {
            topic:'',
            frontside:"",
            backside:"",
            image:"",
            literature:"",
            wikipedia:"",
            wikiskripta:"",
            youtube:"",
            extraLink:"",
            tag:"",
            active:true,
            detail:false,
            clinic:false,
            snackbarOpen: false,
            snackbarMessage: "",
            uploadedFileCloudinaryUrl: ''
        }
    },

    addCard: function (event) {
        event.preventDefault;
        this.setState({
            snackbarOpen: false,
        });
        //Check if frontside and backside contain characters
        if (!this.state.frontside) {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Zadejte otázku"
            });
            return;
        }

        if (!this.state.backside) {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Zadejte odpověď"
            });
            return;
        }
        if (!this.state.topic) {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Topic"
            });
            return;
        }
        //Call add.card method

        const { topic, frontside, backside,
            image, literature, wikipedia, wikiskripta, youtube,
            extraLink, tag, active, detail, clinic } = this.state;

        Meteor.call("add.card", topic, frontside, backside,
            image, literature, wikipedia, wikiskripta, youtube,
            extraLink, tag, active, detail, clinic, (error,result) => {
                this.setState({
                    snackbarOpen: true,
                    snackbarMessage: "Karta přidána",
                    frontside:"",
                    backside:"",
                    image:"",
                    literature:"",
                    wikipedia:"",
                    wikiskripta:"",
                    youtube:"",
                    extraLink:"",
                    tag:"",
                    active:true,
                    detail:false,
                    clinic:false
                });

            })
    },

    onImageDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });
        this.handleImageUpload(files[0]);
    },

    handleImageUpload(file) {
        Cloudinary.upload(file, (err, res) => {
            console.log("Upload Error: " + err);
            if(res) {
                this.setState({
                    image: res.url
                });
            }
        });

    },

    closeSnackbar: function () {
        this.setState({
            snackbarOpen: false,
        });
    },

    getTopics: function () {
        var topicOptions = [];
        Topics.find().fetch().map((topic) => {
            var option = {
                value: topic._id,
                label: topic.name
            };
            topicOptions.push(option);
        });
        return topicOptions;
    },

    topicChange: function (evt) {
        this.setState({ topic: evt.value });
    },

    frontsideChange: function (evt) {
        this.setState({ frontside: evt.target.value });
    },

    backsideChange: function (evt) {
        this.setState({ backside: evt.target.value });
    },

    imageChange: function (evt) {
        this.setState({ image: evt.target.value });
    },

    literatureChange: function (evt) {
        this.setState({ literature: evt.target.value });
    },

    wikipediaChange: function (evt) {
        this.setState({ wikipedia: evt.target.value });
    },

    wikiskriptaChange: function (evt) {
        this.setState({ wikiskripta: evt.target.value });
    },

    youtubeChange: function (evt) {
        this.setState({ youtube: evt.target.value });
    },

    extraLinkChange: function (evt) {
        this.setState({ extraLink: evt.target.value });
    },

    tagChange: function (evt) {
        this.setState({ tag: evt.target.value });
    },

    activeChange: function (evt) {
        this.setState({ active: !this.state.active });
    },

    detailChange: function (evt) {
        this.setState({ detail: !this.state.detail });
    },

    clinicChange: function (evt) {
        this.setState({ clinic: !this.state.clinic });
    },

    render: function () {
        console.log(this.state.topic);
        var topics = this.getTopics();
        return (
            <div>
                <form>

                    <TextField
                        floatingLabelText="Otázka"
                        fullWidth={true}
                        onChange={this.frontsideChange}
                        value={this.state.frontside}
                    />
                    <TextField
                        floatingLabelText="Odpověď"
                        multiLine={true}
                        fullWidth={true}
                        rows={5}
                        rowsMax={10}
                        onChange={this.backsideChange}
                        value={this.state.backside}
                    />
                    <Dropzone
                        multiple={false}
                        accept="image/*"
                        onDrop={this.onImageDrop}>
                        <p>Drop an image or click to select a file to upload.</p>
                    </Dropzone>

                    <div>
                        {this.state.uploadedFileCloudinaryUrl === '' ? null :
                            <div>
                                <p>{this.state.uploadedFile.name}</p>
                                <img src={this.state.uploadedFileCloudinaryUrl} />
                            </div>}
                    </div>
                    <TextField
                        floatingLabelText="Obrázek"
                        fullWidth={true}
                        onChange={this.imageChange}
                        value={this.state.image}
                    />

                    <TextField
                        floatingLabelText="Literatura"
                        fullWidth={true}
                        onChange={this.literatureChange}
                        value={this.state.literature}
                    />

                    <TextField
                        floatingLabelText="Wikipedia"
                        fullWidth={true}
                        onChange={this.wikipediaChange}
                        value={this.state.wikipedia}
                    />

                    <TextField
                        floatingLabelText="Wikiskripta"
                        fullWidth={true}
                        onChange={this.wikiskriptaChange}
                        value={this.state.wikiskripta}
                    />

                    <TextField
                        floatingLabelText="Youtube"
                        fullWidth={true}
                        onChange={this.youtubeChange}
                        value={this.state.youtube}
                    />

                    <TextField
                        floatingLabelText="Externí zdroj"
                        fullWidth={true}
                        onChange={this.extraLinkChange}
                        value={this.state.extraLink}
                    />

                    <TextField
                        floatingLabelText="Komentář"
                        fullWidth={true}
                        onChange={this.tagChange}
                        value={this.state.tag}
                    />
                    <div style={{marginTop: "1%", marginBottom:"1%"}} >
                        <Select
                            name="form-field-name"
                            value={this.state.topic}
                            options={topics}
                            onChange={this.topicChange}
                            placeholder="Vybrat téma"
                        />
                    </div>
                    <div style={styles.toggleDiv}>
                        <Toggle
                            label="Aktivní"
                            labelStyle={styles.toggleLabel}
                            defaultToggled={this.state.active}
                            onToggle={this.activeChange}
                        />
                        <Toggle
                            label="Detail"
                            labelStyle={styles.toggleLabel}
                            defaultToggled={this.state.detail}
                            onToggle={this.detailChange}
                        />
                        <Toggle
                            label="Klinika"
                            labelStyle={styles.toggleLabel}
                            defaultToggled={this.state.clinic}
                            onToggle={this.clinicChange}
                        />
                    </div>

                    <Divider/>

                    <div style={styles.buttons}>
                        <RaisedButton label="Přidat"
                                      style={styles.saveButton}

                                      primary={true}
                                      onClick={this.addCard}

                        />
                    </div>
                    <Snackbar
                        open={this.state.snackbarOpen}
                        message={this.state.snackbarMessage}
                        autoHideDuration={5000}
                        onRequestClose={this.closeSnackbar}
                    />
                </form>
                <div style={{marginTop: "10%"}}>
<CardsTable topicId={this.state.topic} />
{/*                    <TopicCardsTable topic={this.state.topic} />*/}
                </div>
            </div>
        );
    }
});

export default createContainer(() => {
    Meteor.subscribe("topics");

    return { topics: Topics.find().fetch() };
}, AddCard);