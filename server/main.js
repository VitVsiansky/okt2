import { Meteor } from 'meteor/meteor';

import { Topics } from "../imports/collections/topics";
import { CardLogs } from "../imports/collections/cardlogs";

Meteor.startup(() => {
    Meteor.publish("topics", function () {
        return Topics.find({});
    });
    Meteor.publish("users.cards", function () {
        return Meteor.users.find({_id:this.userId},{fields: {activeCards: 1}} );
    });
    Meteor.publish("users.card.logs", function () {
        return CardLogs.find({userId:this.userId});
    });

    Cloudinary.config({
        cloud_name: 'oktavian',
        api_key: '179646141957777',
        api_secret: 'axMPtFGpRM6kudHlqm7csQu2-GE'
    });
});
