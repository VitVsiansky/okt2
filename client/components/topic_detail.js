import React, { Component } from "react";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import AddCardsFromTopic from "./actions/add_cards_from_topic";
import TopicProgress from "./layouts/topic_progress";
import ShowCardsFromTopic from "./actions/show_cards_from_topic";

class TopicDetail extends Component {
    renderImage() {
        if(this.props.selectedTopic.sampleImage) {
            return (
                <CardMedia>
                    <img src={this.props.selectedTopic.sampleImage} style={{maxHeight:300}}/>
                </CardMedia>
            );
        }
    }

    render() {
        return (

            <Card>
                {this.renderImage()}
            <CardTitle title={this.props.selectedTopic.name}    />
            <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
                <div style={{marginBottom: 15}}>
                <ShowCardsFromTopic selectedTopic={this.props.selectedTopic}/>
                    </div>
                <AddCardsFromTopic selectedTopic={this.props.selectedTopic}/>
        <CardActions>
            <div style={{marginTop:20, marginBottom:20}}>
            <TopicProgress selectedTopic={this.props.selectedTopic}/>
                </div>

            </CardActions>
            </Card>
        );

    }
}


export default TopicDetail;