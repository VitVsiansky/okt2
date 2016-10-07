import React,  { PropTypes, Component } from 'react';
import Drawer from 'material-ui/Drawer';
import {spacing, typography} from 'material-ui/styles';
import {white, blue600} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router';
import { createContainer } from "meteor/react-meteor-data";
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Person from 'material-ui/svg-icons/social/person';
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center';
import ClassIcon from 'material-ui/svg-icons/action/class';
import AddToPhotos from 'material-ui/svg-icons/image/add-to-photos';
import BorderColor from 'material-ui/svg-icons/editor/border-color';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class Sidebar extends TrackerReact(React.Component) {
    constructor(props) {
        super(props);

        this.openStudyUnavailableDialog = this.openStudyUnavailableDialog.bind(this);
        this.closeStudyUnavailableDialog = this.closeStudyUnavailableDialog.bind(this);

        this.state = {
            studyUnavailableDialogOpen: false,
            studyContainer: <Link to="/studovat"/>,
            studyAllow: true
        };
    }


    fetchEmail() {
        var email = Meteor.user();
        if(email) {
            return email.emails[0].address;
        }
        else {
            return "";
        }
    }

    allowStudy(queuelength) {
        if(queuelength>0) {
            this.setState({
                studyContainer: <Link to="/studovat"/>,
                studyAllow: true
            });
            return (<Link to="/studovat"/>);
        } else {
            this.setState({
                studyContainer: <span />,
                studyAllow: false
            });
            return (<Link onClick={() => this.openStudyUnavailableDialog} />);
        }
    }

    openStudyUnavailableDialog() {
        if(!this.state.studyAllow) {
            this.setState({
                studyUnavailableDialogOpen: true
            })
        }
    }

    closeStudyUnavailableDialog() {
        this.setState({
            studyUnavailableDialogOpen: false
        })
    }

    componentWillReceiveProps(props) {
        this.allowStudy(props.queue.length);
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
                    backgroundImage: "url('http://res.cloudinary.com/oktavian/image/upload/v1475619644/source_images/material_bg.png')",
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
                    <MenuItem
                        key={5}
                        style={styles.menuItem}
                        primaryText="Profil"
                        leftIcon={<Person />}
                        containerElement={<Link to="/"/>}
                    />
                    <div onClick={() => this.openStudyUnavailableDialog()}>
                    <MenuItem
                        key={1}
                        style={styles.menuItem}
                        primaryText="Studovat"
                        leftIcon={<FitnessCenter />}
                        containerElement={this.state.studyContainer}
                    />
                        </div>
                    <MenuItem
                        key={2}
                        style={styles.menuItem}
                        primaryText="Témata"
                        leftIcon={<ClassIcon />}
                        menuItems={[
                            <MenuItem
                                primaryText="Anatomie"
                                containerElement={<Link to="/temata/anatomie"/>}
                            />,
                            <MenuItem
                                primaryText="Show"
                            />,
                            <MenuItem
                                primaryText="Show"
                            />,
                            <MenuItem
                                primaryText="Show"
                            />,
                            <MenuItem
                                primaryText="Show"
                            />

                        ]}
                        />
                    <MenuItem
                        key={3}
                        style={styles.menuItem}
                        primaryText="Přidat téma"
                        leftIcon={<AddToPhotos />}
                        containerElement={<Link to="/admin/pridattema"/>}
                    />
                    <MenuItem
                        key={4}
                        style={styles.menuItem}
                        primaryText="Přidat kartu"
                        leftIcon={<BorderColor />}
                        containerElement={<Link to="/admin/pridatkartu"/>}
                    />

                </div>
                <Dialog
                    title="Pro dnešek hotovo"
                    actions={<FlatButton
                        label="Zavřít"
                        primary={true}
                        onTouchTap={this.closeStudyUnavailableDialog}
                    />}
                    modal={false}
                    open={this.state.studyUnavailableDialogOpen}
                    onRequestClose={this.closeStudyUnavailableDialog}
                >
                    Dnes už není co studovat. Konečně můžete na pivo!
                </Dialog>
            </Drawer>
        );

    }


}

Sidebar.propTypes = {
    navDrawerOpen: PropTypes.bool,
    menus: PropTypes.array,
    username: PropTypes.string,
};

export default createContainer(() => {
    Meteor.subscribe("userEmail");

    return { email: Meteor.users.findOne({_id: this.userId}, { emails:1}) || "" };
}, Sidebar);