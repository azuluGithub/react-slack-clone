import React, { Component } from 'react';
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../config/firebase'
import './auth.css';

class Login extends Component {
    state = {
        email: '',
        password: '',
        loading: false,
        errors: []
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name] : value
        })
    }

    emptyFields = ({ email, password }) => {
       return email === '' || password === '' ;
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
        } else {
            return true;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { email, password } = this.state;
        if (this.formIsValid()) {
            this.setState({ errors: [], loading: true });
            console.log("logged in successfully");
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ loading: false, errors: []})
            })
            .catch(err => {
                this.setState({ loading: false, errors: this.state.errors.concat(err)});
            })
        }
    }

    render () {
        const { handleChange, handleSubmit, displayErrors, checkError } = this;
        const { email, password, errors, loading } = this.state;
        return (
            <Grid textAlign='center' className="gridHeight" verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' icon color='blue' textAlign='center'>
                    <Icon name="star" color="blue"/>
                    Login to Star-Chat
                </Header>
                <Form size='large' onSubmit={handleSubmit}>
                    <Segment stacked>
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
                        <Button 
                            color="linkedin" 
                            fluid size='large'
                            disabled={loading}
                            className={loading ? "loading" : ""}
                            >
                            Login
                        </Button>
                    </Segment>
                </Form>
                { errors.length > 0 ? <Message color="red"> { displayErrors(errors) }</Message> : "" }
                <Message>
                    Not yet a member? <Link to='/register'>Sign Up</Link>
                </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login;
