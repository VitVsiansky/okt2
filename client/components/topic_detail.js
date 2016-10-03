import React, { Component } from "react";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import AddCardsFromTopic from "./actions/add_cards_from_topic";

class TopicDetail extends Component {
    render() {
        return (

            <Card>
{/*             <CardMedia>
    <img src="https://s-media-cache-ak0.pinimg.com/originals/94/bc/9d/94bc9d77b459e157967034ee301fc465.jpg" />
            </CardMedia>*/}
            <CardTitle title={this.props.selectedTopic.name} subtitle="Card subtitle" />
            <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions>
            <FlatButton label="Action1" />
            <FlatButton label="Action2" />
            <AddCardsFromTopic selectedTopic={this.props.selectedTopic}/>
            </CardActions>
            </Card>
        );

    }
}


export default TopicDetail;