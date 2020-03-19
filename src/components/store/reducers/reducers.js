import { SET_USER, CLEAR_USER } from '../constants/constants';

const initSetUserState = {
    currentUser: null,
    isLoading: true
}

export const set_user_reducer = (state=initSetUserState, action={}) => {
    switch (action.type) {
        case SET_USER:
            return { 
                currentUser: action.payload, 
                isLoading: false 
            }
            
        case CLEAR_USER:
            return {
                ...state,
                isLoading: false
            }
            
        default:
            return state;
    }
}
