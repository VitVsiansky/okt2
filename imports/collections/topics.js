import { Mongo } from "meteor/mongo";

Meteor.methods({
    "add.child.to.topic": function (name, parentname) {
        const newId = Random.id();

        Topics.update({name : parentname},{$push: {children: newId}});

        Topics.insert(
            {
                _id: newId,
                name: name,
                cards: [],
                children: []
            }
        );

    },

    "add.topic": function (name, parentId, textbook, textbookDetails, sampleImage) {
        const newId = Random.id();

        Topics.update({_id : parentId},{$push: {children: newId}});

        Topics.insert(
            {
                _id: newId,
                name: name,
                cards: [],
                children: [],
                textbook: textbook,
                textbookDetails: textbookDetails,
                sampleImage: sampleImage
            }
        );
    },

    "add.card": function (topicId, frontside, backside,
                          image, literature, wikipedia, wikiskripta, youtube,
                          extraLink, tag, active, detail, clinic) {

        console.log("add card called");
        console.log(topicId, frontside);

        const newId = Random.id();

        Topics.update({_id: topicId}, {$push: {cards: {
            _id: newId,
            dateCreated: new Date(),
            frontside: frontside,
            backside: backside,
            image:image,
            literature: literature,
            wikipedia: wikipedia,
            wikiskripta: wikiskripta,
            youtube: youtube,
            extraLink: extraLink,
            tag: tag,
            active: active,
            detail: detail,
            clinic: clinic
        }}});
    },

    "add.card.ids.to.user": function (Ids) {
        Meteor.users.update(Meteor.userId(), {$addToSet: {activeCards: {$each: Ids }}});

    },

    "update.topic": function (newTopic) {
        console.log(newTopic);
        Topics.update({_id:newTopic[0]._id}, newTopic[0]);
    }

});


export const Topics = new Mongo.Collection("topics");