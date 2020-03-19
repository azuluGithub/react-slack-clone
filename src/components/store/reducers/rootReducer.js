import { combineReducers } from 'redux';
import { set_user_reducer } from './reducers';

const rootReducer = combineReducers({
    user: set_user_reducer
})

export default rootReducer;