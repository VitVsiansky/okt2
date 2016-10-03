import React,  { PropTypes, Component } from 'react';
import Drawer from 'material-ui/Drawer';
import {spacing, typography} from 'material-ui/styles';
import {white, blue600} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router';
import Avatar from 'material-ui/Avatar';
import { createContainer } from "meteor/react-meteor-data";
import TrackerReact from 'meteor/ultimatejs:tracker-react';


class Sidebar extends TrackerReact(React.Component) {

/*    getMeteorData() {
        const handle = Meteor.subscribe("userEmail");
        var data = {};
        if (handle.ready()) {
            console.log(Meteor.users.findOne({_id: this.userId}, { emails:1}));
            data = Meteor.users.findOne({_id: this.userId}, { emails:1});
        }
        return data;
    }*/

    fetchEmail() {
        var email = Meteor.user();
        if(email) {
            return email.emails[0].address;
        }
        else {
            return "";
        }
    }

    render() {
        const styles = {
            logo: {
                cursor: 'pointer',
                fontSize: 22,
                color: typography.textFullWhite,
                lineHeight: `${spacing.desktopKeylineIncrement}px`,
                fontWeight: typography.fontWeightLight,
                backgroundColor: blue600,
                paddingLeft: 40,
                height: 56,
            },
            menuItem: {
                color: white,
                fontSize: 14
            },
            avatar: {
                div: {
                    padding: '15px 0 20px 15px',
                    /*                backgroundImage:  'url(' + require('https://udemy-images.udemy.com/user/50x50/8227778_05bc.jpg') + ')',*/
                    height: 45
                },
                icon: {
                    float: 'left',
                    display: 'block',
                    marginRight: 15,
                    boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.2)'
                },
                span: {
                    paddingTop: 12,
                    display: 'block',
                    color: 'white',
                    fontWeight: 300,
                    textShadow: '1px 1px #444'
                }
            }
        };

        let { navDrawerOpen } = this.props;

        return (
            <Drawer
                docked={true}
                open={navDrawerOpen}>
                <div style={styles.logo}>
                    Oktavian
                </div>
                <div style={styles.avatar.div}>
                    <span style={styles.avatar.span}>{this.fetchEmail()}</span>
                </div>
                <div>
                    {this.props.menus.map((menu, index) =>
                        <MenuItem
                            key={index}
                            style={styles.menuItem}
                            primaryText={menu.text}
                            leftIcon={menu.icon}
                            containerElement={<Link to={menu.link}/>}
                        />
                    )}

                </div>
            </Drawer>
        );

    }


};

Sidebar.propTypes = {
    navDrawerOpen: PropTypes.bool,
    menus: PropTypes.array,
    username: PropTypes.string,
};

export default createContainer(() => {
    Meteor.subscribe("userEmail");

    return { email: Meteor.users.findOne({_id: this.userId}, { emails:1}) || "" };
}, Sidebar);