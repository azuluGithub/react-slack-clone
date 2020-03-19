import React, { Component } from 'react';
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../config/firebase';
import md5 from 'md5';
import './auth.css';

class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        cpassword: '',
        loading: false,
        errors: [],
        usersRef: firebase.database().ref('users')
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name] : value
        })
    }

    emptyFields = ({ email, username, password, cpassword }) => {
       return email === '' || password === '' || cpassword === '' || username === '';
    }

    passwordsDontMatch = ({ password, cpassword }) => {
        return password !== cpassword;
    }

    shorterPassword = ({ password, cpassword }) => {
        return password.length < 6 || cpassword.length < 6;
    }

    setErrors = (error) => {
        let errors = [];
        this.setState({ errors: errors.concat(error) })
    }

    displayErrors = (errors) => {
        const err = errors.map((error, i) => {
            return <p key={i}>{ error.message }</p>
        })
        return err;
    }

    checkError = (errors, inputName) => {
        const check = errors.some(error => {
            return error.message.includes(inputName);
        })
        return check;
    }

    formIsValid = () => {
        let error;
        if (this.emptyFields(this.state)) {
            error = { message: "fill in all fields" }
            this.setErrors(error);
            return false;
        } else if (this.passwordsDontMatch(this.state)) {
            error = { message: "passwords don't match" }
            this.setErrors(error);
            return false;
        } else if (this.shorterPassword(this.state)) {
            error = { message: "passwords must be 6 or more characters long" }
            this.setErrors(error);
            return false;
        } else {
            return true;
        }
    }

    saveUser = (createdUser) => {
        const { usersRef } = this.state;
        return usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, email, password } = this.state;
        if (this.formIsValid()) {
            this.setState({ errors: [], loading: true });
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: username,
                    photoURL: `https://www.gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon` //`https://robohash.org/${cat.id}?size=200x200&set=set4`
                })
                .then (() => {
                    this.saveUser(createdUser)
                    .then(() => {
                        console.log("user saved successfully!");
                    })
                })
                .catch(err => {
                    this.setState({ loading: false, errors: this.state.errors.concat(err) });
                })
            })
            .catch(err => {
                this.setState({ loading: false, errors: this.state.errors.concat(err) });
            })
        }
    }

    render () {
        const { handleChange, handleSubmit, displayErrors, checkError } = this;
        const { username, email, password, cpassword, errors, loading } = this.state;
        return (
            <Grid textAlign='center' className="gridHeight" verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' icon color='teal' textAlign='center'>
                    <Icon name="star" color="teal"/>
                    Register to Star-Chat
                </Header>
                <Form size='large' onSubmit={handleSubmit}>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            icon='user' 
                            iconPosition='left' 
                            placeholder='Username'
                            name='username'
                            onChange={handleChange}
                            value={username}
                        />
                        <Form.Input
                            fluid
                            icon='mail' 
                            iconPosition='left' 
                            placeholder='E-mail address'
                            name='email'
                            className={ checkError(errors, "email") ? "error" : "" }
                            onChange={handleChange}
                            value={email}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            name='password'
                            className={ checkError(errors, "password") ? "error" : "" }
                            onChange={handleChange}
                            value={password}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Confirm Password'
                            type='password'
                            name='cpassword'
                            className={ checkError(errors, "password") ? "error" : "" }
                            onChange={handleChange}
                            value={cpassword}
                        />
                        <Button 
                            color="teal" 
                            fluid size='large'
                            disabled={loading}
                            className={loading ? "loading" : ""}
                            >
                            Register
                        </Button>
                    </Segment>
                </Form>
                { errors.length > 0 ? <Message color="red"> { displayErrors(errors) }</Message> : "" }
                <Message>
                    Already a member? <Link to='/login'>Sign In</Link>
                </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;
