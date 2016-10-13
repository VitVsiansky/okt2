import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

import App from "./components/app";
import Login from "./components/authentication/login";
import Register from "./components/authentication/register";
import TopicsView from "./components/topics_view";
import AddTopic from "./components/administration/add_topic";
import AddCard from "./components/administration/add_card";
import Study from "./components/actions/study";
import Dashboard from "./components/dashboard/dashboard";
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const routes = (
    <Router history={browserHistory}>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/" component={App}>
            <IndexRoute component={Dashboard}/>
            <Route path = "studovat" component={Study} />
            <Route path = "temata/:topic" component={TopicsView} />
            <Route path="admin">
                <Route path="pridattema" component={AddTopic}/>
                <Route path="pridatkartu" component={AddCard}/>
            </Route>
        </Route>
    </Router>
);

$.cloudinary.config({
    cloud_name: "oktavian"
});

Meteor.startup(() => {
    ReactDOM.render(routes, document.querySelector(".render-target"));

});