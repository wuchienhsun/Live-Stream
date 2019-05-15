import React, { Component } from 'react';
import { BrowserRouter as Router,Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Stream from './components/Stream';
import Dashboard from './components/dashboard/Dashboard'
import Coin from './components/coin/Coin';
import CoinDashboard from './components/coin/CoinDashboard';
import Setting from './components/Setting';
import List from './components/List';
import Video from './components/video/Video'
import DonateList from './components/DonateList';
import EditVideo from './components/video/EditVideo'



import './App.css';

// Check for token 
if(localStorage.jwtToken){
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuth
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() /1000;
  if(decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    // Redirect to login
    window.location.href = '/login';
  }
}




class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div id="App" className="App">
            <Navbar />
              <Route exact path="/" component={ Landing } />
              
                <div className='container'>
                <Route exact path="/video/:id" component={ Video } />
                <Route exact path="/coin" component={ Coin } />
                <Route exact path="/register" component={ Register } />
                <Route exact path="/login" component={ Login } />
                <Route exact path="/list" component={ List } />
                <Route exact path='/edit/:id' component={ EditVideo } />
                
                <Switch>
                  <PrivateRoute exact path="/dashboard" component={ Dashboard } />
                </Switch>
                
                <Switch>
                  <PrivateRoute exact path="/coindashboard" component={ CoinDashboard } />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/setting" component={ Setting } />
                </Switch>    
                <Switch>
                  <PrivateRoute exact path="/donatelist" component={ DonateList } />
                </Switch>                             
                
              </div>              
              <div className="container-fluid">
                <Route exact path="/a.:user_name" component={ Stream } />
            </div>
            <Footer />
            
          </div>
        </Router>      
      </Provider>      
    );
  }
}



export default App;
