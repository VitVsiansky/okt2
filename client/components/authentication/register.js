import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {grey500, white} from 'material-ui/styles/colors';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Help from 'material-ui/svg-icons/action/help';
import TextField from 'material-ui/TextField';
import {Link, browserHistory } from 'react-router';
import ThemeDefault from '../../themes/theme-default';
import EmailValidator from "email-validator";
import Snackbar from 'material-ui/Snackbar';

const styles = {
    loginContainer: {
        minWidth: 320,
        maxWidth: 400,
        height: 'auto',
        position: 'absolute',
        top: '20%',
        left: 0,
        right: 0,
        margin: 'auto'
    },
    paper: {
        padding: 20,
        overflow: 'auto'
    },
    buttonsDiv: {
        textAlign: 'center',
        padding: 10
    },
    flatButton: {
        color: grey500
    },
    checkRemember: {
        style: {
            float: 'left',
            maxWidth: 180,
            paddingTop: 5
        },
        labelStyle: {
            color: grey500
        },
        iconStyle: {
            color: grey500,
            borderColor: grey500,
            fill: grey500
        }
    },
    loginBtn: {
        textAlign: 'center',
        marginLeft: "35%"
    },
    btn: {
        background: '#4f81e9',
        color: white,
        padding: 7,
        borderRadius: 2,
        margin: 2,
        fontSize: 13
    },
    btnSpan: {
        marginLeft: 5
    },
};

var Register = React.createClass({
    getInitialState:function(){
        return {
            email:'',
            password:"",
            snackbarOpen: false,
            snackbarMessage: ""
        }
    },

    emailChange: function (evt) {
        this.setState({ email: evt.target.value });
    },

    passwordChange: function (evt) {
        this.setState({ password: evt.target.value });
    },

    register: function (event) {
        event.preventDefault();
        //Check if email is valid string
        if(!EmailValidator.validate(this.state.email)) {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Nesprávný formát emailu"
            });
            return;
        }

        if(!this.state.password) {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Zadejte prosím heslo"
            });
            return;
        }

        Accounts.createUser({
            email: this.state.email,
            password: this.state.password
        }, (error) => {
            if(error){
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Uživatel už existuje"
            });
            } else {
                browserHistory.push("/");
            }
        })
    },

    render: function () {
        return (
            <MuiThemeProvider muiTheme={ThemeDefault}>
                <div>
                    <div style={styles.loginContainer}>

                        <Paper style={styles.paper}>

                            <form>
                                <TextField
                                    hintText="E-mail"
                                    floatingLabelText="E-mail"
                                    fullWidth={true}
                                    onChange={this.emailChange}
                                    value={this.state.email}
                                />
                                <TextField
                                    hintText="Password"
                                    floatingLabelText="Password"
                                    fullWidth={true}
                                    type="password"
                                    onChange={this.passwordChange}
                                    value={this.state.password}
                                />

                                <div>


                                        <RaisedButton label="Registrovat"
                                                      primary={true}
                                                      type="submit"
                                                      style={styles.loginBtn}
                                                      onSubmit={this.register}
                                                      onClick={this.register}/>

                                </div>
                            </form>
                        </Paper>

                        <div style={styles.buttonsDiv}>
                            <FlatButton
                                label="Přihlásit se"
                                href="/login"
                                style={styles.flatButton}
                                icon={<PersonAdd />}
                            />
                        </div>
                    </div>
                    <Snackbar
                        open={this.state.snackbarOpen}
                        message={this.state.snackbarMessage}
                        autoHideDuration={5000}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
});

export default Register;