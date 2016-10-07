import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import {grey500, white} from 'material-ui/styles/colors';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Help from 'material-ui/svg-icons/action/help';
import TextField from 'material-ui/TextField';
import {Link, browserHistory} from 'react-router';
import ThemeDefault from '../../themes/theme-default';
import Snackbar from 'material-ui/Snackbar';
import {typography} from 'material-ui/styles';

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
        float: 'right'
    },
    btn: {
        background: '#4f81e9',
        color: white,
        padding: 7,
        borderRadius: 2,
        margin: 2,
        fontSize: 13
    },
    btnFacebook: {
        background: '#4f81e9'
    },
    btnGoogle: {
        background: '#e14441'
    },
    btnSpan: {
        marginLeft: 5
    },
    title: {
        fontSize: 24,
        fontWeight: typography.fontWeightLight,
        marginBottom: 10,
        textAlign: "center"
    }
};

var Login = React.createClass({
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

    login: function (event) {
        event.preventDefault();
        Meteor.loginWithPassword({
            email: this.state.email
        }, this.state.password, (error) => {
            if(error) {
                console.log(error);
                if(error.reason == "User not found") {
                    this.setState({
                        snackbarOpen: true,
                        snackbarMessage: "Uživatel neexistuje"
                    })
                }
                if(error.reason == "Incorrect password") {
                    this.setState({
                        snackbarOpen: true,
                        snackbarMessage: "Nesprávné heslo"
                    })
                }
            } else {
                browserHistory.push("/");
            }
        });
    },

    render: function () {
        return (
            <MuiThemeProvider muiTheme={ThemeDefault} >
                <div>
                    <div style={styles.loginContainer}>

                        <Paper style={styles.paper}>
                            <div style={styles.title}>
                                Přihlaste se
                            </div>
                            <form>
                                <TextField
                                    hintText="E-mail"
                                    floatingLabelText="E-mail"
                                    fullWidth={true}
                                    onChange={this.emailChange}
                                    value={this.state.email}
                                />
                                <TextField
                                    hintText="Heslo"
                                    floatingLabelText="Heslo"
                                    fullWidth={true}
                                    type="password"
                                    onChange={this.passwordChange}
                                    value={this.state.password}
                                />

                                <div>
  {/*                                  <Checkbox
                                        label="Remember me"
                                        style={styles.checkRemember.style}
                                        labelStyle={styles.checkRemember.labelStyle}
                                        iconStyle={styles.checkRemember.iconStyle}
                                    />*/}


                                    <RaisedButton label="Přihlásit"
                                                  primary={true}
                                                  type="submit"
                                                  style={styles.loginBtn}
                                                  onSubmit={this.login}
                                                  onClick={this.login}


                                    />
                                </div>
                            </form>
                        </Paper>

                        <div style={styles.buttonsDiv}>
                            <FlatButton
                                label="Registrovat se"
                                href="/register"
                                style={styles.flatButton}
                                icon={<PersonAdd />}
                            />

{/*                            <FlatButton
                                label="Forgot Password?"
                                href="/"
                                style={styles.flatButton}
                                icon={<Help />}
                            />*/}
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

export default Login;