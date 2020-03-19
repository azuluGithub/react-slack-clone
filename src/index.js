import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './components/App.css';
import "semantic-ui-css/semantic.min.css";
import App from './components/App';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import firebase from '../src/config/firebase';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './components/store/reducers/rootReducer';
import { setUser, clearUser } from './components/store/actions/actions';
import Spinner from './components/Spinner';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.setUser(user);
                this.props.history.push("/");
            } else { //ORIGINAL
                this.props.history.push("/login");
                this.props.clearUser();
            } /*else { //TESTING
                user = { displayName: "star", photoURL: `https://robohash.org/1234?set=set1` };
                this.props.setUser(user);
                this.props.history.push("/"); 
            }*/
        })
    }

    render() {
        return this.props.isLoading ? <Spinner /> : (
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />  
            </Switch>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.user.isLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => dispatch(setUser(user)),
        clearUser: () => dispatch(clearUser())
    }
}

const RootWithAuth = withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
