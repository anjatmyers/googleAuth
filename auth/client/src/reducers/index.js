
import {combineReducers} from 'redux';
import reducerTemplate from './reducer';
import auth from './auth'
// import {formReducer} from 'redux-form'


export default combineReducers({
    auth: reducerTemplate
    // form: formReducer
    // auth2: auth

})