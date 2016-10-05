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
                // last interval is in minutes
                lastInterval: 0,
                repCount: 0,
                history: []

            },
            {upsert:true}
        );
    },

    "answer.card": function (quality, cardId) {
        var card = CardLogs.find({"cardId": cardId}).fetch()[0];
        console.log("logging card from call " + card.cardId);
        const EF = card.EF;
        const repCount = card.repCount;
        const lastInterval = card.lastInterval;

        function computeEF(quality) {
            var resultingEF;
            if(quality==="again") {
                resultingEF = EF - 0.35;
            }
            if(quality==="hard") {
                resultingEF = EF - 0.25;
            }
            if(quality==="good") {
                resultingEF = EF + 0.1;
            }
            if(quality==="easy") {
                resultingEF = EF + 0.4;
            }

            if(resultingEF < 1.3) {
                resultingEF = 1.3;
            }

            return resultingEF;
        }

        function computeDueDate(EF) {
            if(repCount === 0) {
                return moment().add(1, "days").toDate();
            }
            else if(repCount === 1) {
                return moment().add(4, "days").toDate();
            } else {
                var interval = lastInterval * EF;
                return moment().add(interval, "minutes").toDate();
            }


        }

        function setLastInterval(EF) {
            if(repCount === 0) {
                return 1440;
            }
            else if(repCount === 1) {
                return 5760;
            } else {
                var interval = lastInterval * EF;
                return interval;
            }

        }

        if(quality === "again") {
            CardLogs.update({
                    "cardId": cardId},
                {
                    cardId: cardId,
                    userId: Meteor.userId(),
                    dueDate: moment(23, "HH").toDate(),
                    EF: computeEF("again"),
                    lastInterval: 0,
                    repCount: 0
                });
        }

        if(quality === "good") {
            CardLogs.update({
                    "cardId": cardId},
                {
                    cardId: cardId,
                    userId: Meteor.userId(),
                    dueDate: computeDueDate(computeEF("good")),
                    EF: computeEF("good"),
                    lastInterval: setLastInterval(computeEF("good")),
                    repCount: repCount+1
                });

            CardLogs.update({
                    "cardId": cardId},
                {$push: { history: { reviewedAt: moment().endOf("day").toDate()}}});
        }

        if(quality === "hard") {
            CardLogs.update({
                    "cardId": cardId},
                {
                    cardId: cardId,
                    userId: Meteor.userId(),
                    dueDate: computeDueDate(computeEF("hard")),
                    EF: computeEF("hard"),
                    lastInterval: setLastInterval(computeEF("hard")),
                    repCount: repCount+1
                });

            CardLogs.update({
                    "cardId": cardId},
                {$push: { history: { reviewedAt: moment().endOf("day").toDate()}}});
        }

        if(quality === "easy") {
            CardLogs.update({
                    "cardId": cardId},
                {
                    cardId: cardId,
                    userId: Meteor.userId(),
                    dueDate: computeDueDate(computeEF("easy")),
                    EF: computeEF("easy"),
                    lastInterval: setLastInterval(computeEF("easy")),
                    repCount: repCount+1
                });

            CardLogs.update({
                    "cardId": cardId},
                {$push: { history: { reviewedAt: moment().endOf("day").toDate()}}});
        }


    }
});

export const CardLogs = new Mongo.Collection("cardlogs");