import React from "react";

import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import Sidebar from "./layouts/sidebar";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ThemeDefault from '../themes/theme-default';
import Data from '../themes/data';
import Header from "./layouts/header";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {browserHistory} from 'react-router';
import { CardLogs } from "../../imports/collections/cardlogs";
import { Topics } from "../../imports/collections/topics";
import { ToDo } from "../../imports/collections/todo";
import _ from "lodash";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends TrackerReact(React.Component) {
    constructor(props) {
        super(props);
        this.state = this.getMeteorData();
    }

    constructQueue() {
        Meteor.subscribe("users.card.logs");
        Meteor.subscribe("topics", () => {
            var topics = Topics.find({}).fetch();

            //Queue resets every day after 23:00
            var today = new Date();
            today.setHours(23);

            //Find and sort users cards by dueDate
            var due = CardLogs.find({ "dueDate" : {"$lt" : today }}, {sort: {dueDate: 1}});

            //Build a queue using the fetched cards from CardLogs collection
            var queue =[];

            due.forEach((cardLog) => {
                var filtered = _.filter(topics, {cards: [{_id: cardLog.cardId}] });
                if(filtered[0]) {
                    card = _.filter(filtered[0].cards, {_id: cardLog.cardId});
                    queue.push(card);
                }
            });

            queue = [].concat.apply([], queue);


             if(queue != []) {

                 Meteor.call("set.today.todo", queue.length);

             this.setState({
             queue: queue
             });

             }
        });

    }

    setTodayToDoCount(cardCount) {
        var toDos = JSON.parse(localStorage.getItem("TodayToDoCount"));
        toDos = _.filter(toDos, {date: moment().startOf('day')});
        toDos = _.filter(toDos, {userId: Meteor.userId()});

        console.log(toDos);
        if(!toDos) {
            toDos.push({
                date: moment().startOf('day'),
                userId: Meteor.userId(),

            })
        }
    }

    getMeteorData(){
        return { isAuthenticated: Meteor.userId() !== null,
            navDrawerOpen: false,
            queue: [],
            cardsToDoCount: []};
    }

    componentWillMount(){
        if (!this.state.isAuthenticated) {
            browserHistory.push('/login');
        }
        this.constructQueue();
    }

    componentDidUpdate(){
        if (!this.state.isAuthenticated) {
            browserHistory.push('/login');
        }

    }

    componentDidMount() {
        this.constructQueue();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.width !== nextProps.width) {
            this.setState({navDrawerOpen: nextProps.width === LARGE});
        }
        this.constructQueue();
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
                paddingLeft: navDrawerOpen ? paddingLeftDrawerOpen : 0
            },
            container: {
                margin: '80px 20px 20px 15px',
                paddingLeft: navDrawerOpen && this.props.width !== SMALL ? paddingLeftDrawerOpen : 0
            }
        };


        return (
            <MuiThemeProvider muiTheme={ThemeDefault}>
                <div>

                    <Header styles={styles.header}
                            handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer.bind(this)}/>


                    <Sidebar navDrawerOpen={navDrawerOpen}
                             menus={Data.menus}
                             username="User Admin"
                             queue={this.state.queue}
                    />

                    <div style={styles.container}>
                        {React.cloneElement(this.props.children, { queue: this.state.queue })}
                    </div>
                </div>
            </MuiThemeProvider>
        );}
}


export default withWidth()(App);