import React, { Component } from 'react';
import firebase from '../../config/firebase';
import { Menu, Icon, Modal, Button, Form } from 'semantic-ui-react';

class Channels extends Component {
    state = {
        channels: [],
        channelName: "",
        channelDetails: "",
        modal: false,
        currentUser: this.props.currentUser,
        channelsRef: firebase.database().ref("channels")
    }

    openModal = () => {
        this.setState({ modal: true })
    }

    closeModal = () => {
        this.setState({ modal: false })
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name] : value })
    }

    formIsValid = ({ channelName, channelDetails }) => {
        return channelName.length && channelDetails.length
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, currentUser } = this.state;
        const key = channelsRef.push().key;
        channelsRef.child(key).update({
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: currentUser.displayName,
                avatar: currentUser.photoURL
            }
        })
        .then(() => {
            this.setState({ channelName: '', channelDetails: ''});
            this.closeModal();
            console.log("channel created")
        })
        .catch(err => console.error(err))
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.formIsValid(this.state)) {
            this.addChannel();
        }
    }

    render() {
        const { channels, modal } = this.state;
        const { openModal, closeModal, handleSubmit, handleChange } = this;
        return (
            <React.Fragment>
                <Menu.Menu>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" />
                        </span> {" "}
                        CHANNELS [{channels.length}]
                        <Icon name="add" onClick={openModal}/>
                    </Menu.Item>
                </Menu.Menu>
                <Modal basic open={modal} onClose={closeModal}>
                    <Modal.Header>Add Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={handleSubmit}>
                            <Form.Input
                                fluid
                                placeholder='Channel Name'
                                name='channelName'
                                onChange={handleChange}
                            />
                            <Form.Input
                                fluid
                                placeholder='Channel Details'
                                name='channelDetails'
                                onChange={handleChange}
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" onClick={handleSubmit}>
                            <Icon name="check" inverted/>
                            Add
                        </Button>
                        <Button color="red" onClick={closeModal}>
                            <Icon name="close" inverted/>
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}

export default Channels;
