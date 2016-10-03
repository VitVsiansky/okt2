import { Mongo } from "meteor/mongo";


Meteor.methods({
    "add.new.card.to.logs": function (id) {
        CardLogs.update({
                "cardId": id},
            {
                cardId: id,
                userId: Meteor.userId(),
                dueDate: new Date(),
                EF:2.5,
                lastInterval: 0
            },
            {upsert:true}
        );
    }
});

export const CardLogs = new Mongo.Collection("cardlogs");