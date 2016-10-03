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
                lastInterval: 0,
                repCount: 0
            },
            {upsert:true}
        );
    },

    "answer.card": function (quality, cardId) {
        var card = CardLogs.find({"cardId": cardId}).fetch()[0];
        console.log("logging card from call " + card.cardId);

        if(quality === 0) {
            CardLogs.update({
                    "cardId": cardId},
                {
                    cardId: cardId,
                    userId: Meteor.userId(),
                    dueDate: moment(23, "HH").toDate(),
                    EF:2.5,
                    lastInterval: 0,
                });
        }

        if(quality === 4) {
            CardLogs.update({
                    "cardId": cardId},
                {
                    cardId: cardId,
                    userId: Meteor.userId(),
                    dueDate: moment().add(1, "days").toDate(),
                    EF:2.5,
                    lastInterval: 0
                });
        }


    }
});

export const CardLogs = new Mongo.Collection("cardlogs");