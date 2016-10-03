import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

import App from "./components/app";
import Login from "./components/authentication/login";
import Register from "./components/authentication/register";
import TopicsView from "./components/topics_view";
import AddTopic from "./components/administration/add_topic";
import AddCard from "./components/administration/add_card";

const routes = (
    <Router history={browserHistory}>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/" component={App}>
            <IndexRoute component={TopicsView}/>
            <Route path="/admin">
                <Route path="/admin/pridattema" component={AddTopic}/>
                <Route path="/admin/pridatkartu" component={AddCard}/>
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