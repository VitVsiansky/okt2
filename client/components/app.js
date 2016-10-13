import React from "react";

import withWidth, { LARGE, SMALL } from 'material-ui/utils/withWidth';
import Sidebar from "./layouts/sidebar";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ThemeDefault from '../themes/theme-default';
import Data from '../themes/data';
import Header from "./layouts/header";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { browserHistory } from 'react-router';
import { CardLogs } from "../../imports/collections/cardlogs";
import { Topics } from "../../imports/collections/topics";
import { ToDo } from "../../imports/collections/todo";
import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');





class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
             isAuthenticated: Meteor.userId() !== null,
            navDrawerOpen: false,
            queue: [],
            cardsToDoCount: []
        }
    }

    componentWillMount() {
        if (!this.state.isAuthenticated) {
            browserHistory.push('/login');
        }
    }

    componentDidUpdate() {
        if (!this.state.isAuthenticated) {
            browserHistory.push('/login');
        }

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.width !== nextProps.width) {
            this.setState({ navDrawerOpen: nextProps.width === LARGE });
        }
    }

    handleChangeRequestNavDrawer() {
        this.setState({
            navDrawerOpen: !this.state.navDrawerOpen
        });
    }

    render() {
        let { navDrawerOpen } = this.state;

        const paddingLeftDrawerOpen = 236;

        const styles = {
            header: {
                paddingLeft: this.state.navDrawerOpen ? paddingLeftDrawerOpen : 0
            },
            container: {
                margin: '80px 20px 20px 15px',
                paddingLeft: navDrawerOpen && this.props.width !== SMALL ? paddingLeftDrawerOpen : 0
            }
        };




        if (this.props.loading) {
            return (
<div className="loading">Loading</div>
            );
        }



        return (
             <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
            <MuiThemeProvider muiTheme={ThemeDefault}>
                <div>

                    <Header styles={styles.header}
                        handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer.bind(this)} />




                    <Sidebar navDrawerOpen={navDrawerOpen}
                        menus={Data.menus}
                        username="User Admin"
                        queue={this.props.queue}
                        />

                    <div style={styles.container}>
                        {React.cloneElement(this.props.children, {
                            queue: this.props.queue,
                            againDueDate: this.props.againDueDate,
                            cardsToDoToday: this.props.cardsToDoToday
                        })}
                    </div>
                </div>
            </MuiThemeProvider>
                        </ReactCSSTransitionGroup>
        );
    }
}

const AppContainer = withWidth()(App);

export default createContainer(() => {
    Meteor.subscribe("users.card.logs");
    Meteor.subscribe("users.today.todo");
    const topicsHandle = Meteor.subscribe('topics');
    const loading = !topicsHandle.ready();
    if (loading) {
        return { loading }
    }
    else {
        var topics = Topics.find({}).fetch();

        //Queue resets every day after 23:00
        var today = new Date();
        today.setHours(23);

        //Find and sort users cards by dueDate
        var due = CardLogs.find({ "dueDate": { "$lt": today } }, { sort: { dueDate: 1 } });

        if (!due.fetch().length) {
            var againDueDate = 0;
        } else {
            //Set due date for again answer
            var againDueDate;
            if (due.fetch().length == 1) {
                againDueDate = new Date();
            }
            else if (due.fetch().length <= 15) {
                againDueDate = moment(due.fetch()[due.fetch().length - 1].dueDate).add(1, 'seconds').toDate();
            } else {
                againDueDate = moment(due.fetch()[15].dueDate).add(1, 'seconds').toDate();
            }
        }
        //Build a queue using the fetched cards from CardLogs collection
        var queue = [];

        due.forEach((cardLog) => {
            var filtered = _.filter(topics, { cards: [{ _id: cardLog.cardId }] });
            if (filtered[0]) {
                card = _.filter(filtered[0].cards, { _id: cardLog.cardId });
                queue.push(card);
            }
        });

        queue = [].concat.apply([], queue);

        //Set today todo
        Meteor.call("set.today.todo", queue.length);

        var cardsToDoToday = ToDo.find({}).fetch()[0].count;


        return { loading, queue, againDueDate, cardsToDoToday }



    }

}, AppContainer)
