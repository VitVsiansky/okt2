import React from "react";
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import {grey400, cyan600, white} from 'material-ui/styles/colors';
import {typography} from 'material-ui/styles';
import WhatsHot from 'material-ui/svg-icons/social/whatshot';

const styles = {
    subheader: {
        fontSize: 24,
        fontWeight: typography.fontWeightLight,
        backgroundColor: cyan600,
        color: white
    }
};


class NewsList extends TrackerReact(React.Component) {

    render () {
        return (
            <Paper>
                <List>
                    <Subheader style={styles.subheader}>Novinky</Subheader>
                    {this.props.news.map(item =>
                        <div key={item.title}>
                            <ListItem
                                leftAvatar={<Avatar icon={<WhatsHot />} />}
                                primaryText={item.title}
                                secondaryText={item.text}
                            />
                            <Divider inset={true} />
                        </div>
                    )}
                </List>
            </Paper>
        );
    }
}

export default NewsList;