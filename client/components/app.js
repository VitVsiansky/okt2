import React from "react";

import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import Sidebar from "./layouts/sidebar";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ThemeDefault from '../themes/theme-default';
import Data from '../themes/data';
import Header from "./layouts/header";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Link, browserHistory} from 'react-router';
import { CardLogs } from "../../imports/collections/cardlogs";
import { Topics } from "../../imports/collections/topics";
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
        Meteor.subscribe("topics");
        var topics = Topics.find({});
        var today = new Date();
        today.setHours(23);
        var due = CardLogs.find({ "dueDate" : {"$lt" : today }});




        var queue =[];
console.log(due);

        due.forEach((cardLog) => {
            Meteor.subscribe("topics", () => {
                this.findTopic(cardLog);
                if (this.props.card) {
                    this.props.card = _.filter(this.props.card.cards, {_id: cardLog._id});
                    var card = this.props.card[0];
                    console.log(card);
                    queue.push(card);
                }

                console.log(queue);

            });

        });




    }

    findTopic(cardLog) {
        this.props.card = Topics.findOne({"cards._id":cardLog._id}, {_id:0, "cards": 1});
        console.log(this.props.card);
    }

    getMeteorData(){
        return { isAuthenticated: Meteor.userId() !== null,
                navDrawerOpen: false};
    }

    componentWillMount(){
        if (!this.state.isAuthenticated) {
            browserHistory.push('/login');
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (!this.state.isAuthenticated) {
            browserHistory.push('/login');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.width !== nextProps.width) {
            this.setState({navDrawerOpen: nextProps.width === LARGE});
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
                paddingLeft: navDrawerOpen ? paddingLeftDrawerOpen : 0
            },
            container: {
                margin: '80px 20px 20px 15px',
                paddingLeft: navDrawerOpen && this.props.width !== SMALL ? paddingLeftDrawerOpen : 0
            }
        };



{this.constructQueue()}
        var topics = Topics.find({}).fetch();
        console.log(topics);
        var filtered = _.filter(topics, {cards: [{_id: 'PKNDdkJgrjNeauiHX'}] });
        console.log(filtered);
    return (
        <MuiThemeProvider muiTheme={ThemeDefault}>
            <div>

             <Header styles={styles.header}
             handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer.bind(this)}/>


                <Sidebar navDrawerOpen={navDrawerOpen}
                            menus={Data.menus}
                            username="User Admin"
               />

                <div style={styles.container}>
                    {this.props.children}
                </div>
            </div>
        </MuiThemeProvider>
    );}
}


export default withWidth()(App);