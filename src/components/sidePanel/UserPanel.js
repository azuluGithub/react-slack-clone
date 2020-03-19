import React, { Component } from 'react'
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../config/firebase';

class UserPanel extends Component {

    state = {
        currentUser: this.props.currentUser
    }

    signOut = () => {
        firebase
        .auth()
        .signOut()
        .then(() => console.log("signout success"));
    }

    dropOption = () => {
        const { signOut } = this;
        const { currentUser } = this.state;
        return [
                {
                    key: "user",
                    text: <span>Signed in as <strong>{ currentUser.displayName }</strong></span>,
                    disabled: true
                },
                {
                    key: "avatar",
                    text: <span>Change Avatar</span>
                },
                {
                    key: "signout",
                    text: <span onClick={signOut}>Sign Out</span>
                }
            ]
    } 

    render() {
        const { currentUser } = this.state;
        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row style={{ margin: 0, padding: '1.2em'}}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="star"/>
                            <Header.Content>StarChat</Header.Content>
                        </Header>
                        <Header inverted as="h4" style={{ padding: '0.25em' }}>
                        <Dropdown 
                            trigger={
                                <span>
                                    <Image 
                                        src={currentUser.photoURL}
                                        spaced="right"
                                        avatar
                                    />
                                    { currentUser.displayName }
                                </span>
                                }
                            options={this.dropOption()}
                        />
                    </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel;
