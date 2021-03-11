import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Welcome from './components/Welcome';
import Feature from './components/Feature'; //protect
import Signin from './components/auth/Signin';
import Signout from './components/auth/Signout';
import Signup from './components/auth/Signup';
import CompleteCallback from './components/CompleteCallback'
import BaseLayout from './components/layout/BaseLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import  './assets/styles.scss';
import {createStore, applyMiddleware, compose} from 'redux';
import reduxThunk from 'redux-thunk';
import {Provider} from 'react-redux';
import reducer from './reducers/index'; //don't have to put index, its implied
import requireAuth from './requireAuth';
import axios from 'axios'
import {
  BrowserRouter as Router,
  Route, Switch
} from 'react-router-dom'

  
const checkToken = async() => {
  const token = localStorage.getItem('token');

  if(token === null){
    return "";
  }
  else{
    let response = await axios.post(
      "http://localhost:3001/checkToken",{},
      
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "content-type": "application/json",
          authorization: token,
        },
      }
    );//end of request

    console.log(`token information valid: ${response.data}`);
  }
}

const token = checkToken();
  

// initializing redux store
// requires a reducer. Second argument is for redux dev-tools extension.
let store = createStore(reducer, {auth: {authenticated: ""}}, 
  compose(
    applyMiddleware(reduxThunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ) );


//provider hooks react to redux.  
//Must pass redux instance to provider via "store" prop.

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <Router>
      <BaseLayout>
          <Switch>
            <Route exact path='/' component={App}/>
            <Route path='/welcome' component={requireAuth(Welcome)}/>
            <Route path='/signup' component={Signup}/>
            <Route path='/feature' component={requireAuth(Feature)}/>
            <Route path='/signout' component={Signout}/>
            <Route path='/signin' component={Signin}/>
            <Route path='/completecallback/:code' component={CompleteCallback}/>
          </Switch>
      </BaseLayout>
      </Router>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
