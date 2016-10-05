import { Mongo } from "meteor/mongo";

Meteor.methods({
    "set.today.todo": function (cardsDueCount) {
        ToDo.update({
            userId: Meteor.userId(),
            date: moment().endOf("day").toDate(),
        },
            {
                $set: {userId: Meteor.userId()},
                $set: {date: moment().endOf("day").toDate()},
                $setOnInsert: {count: cardsDueCount}
            }, {
                upsert: true
            });
    },

    "update.todo.on.cards.add": function (cardsAddedCount) {
        ToDo.update({
            userId: Meteor.userId(),
            date: moment().endOf("day").toDate(),
        }, {
            $inc: {count: cardsAddedCount}
        });
    }

});

export const ToDo = new Mongo.Collection("todo");