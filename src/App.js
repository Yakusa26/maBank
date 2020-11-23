import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import * as axios from 'axios';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: ''
    }
  }
  saveUsers = (apiUrl) => {
    axios.post(apiUrl);
  }

  async verifyPassword (apiUrl) {
    try {
       let res = await axios({
            url: apiUrl,
            method: 'get',
            timeout: 8000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return res.data
    }
    catch (err) {
        console.error(err);
    }
}
  render (){
    return (
      <Router>
        <div className="App">
          <Switch>
              <Route path="/login" render= {(props) => {
                    return(<div className="d-flex row">
                      <div className="p-2 col" > <Login verifyPassword = {this.verifyPassword}/> </div>
                    </div>)
                  }} 
              />
              <Route path="/signup" render= {(props) => {
                    return(<div className="d-flex row">
                      <div className="p-2 col" > <Signup saveUsers = {this.saveUsers}/> </div>
                    </div>)
                  }} 
              />
              <Redirect to='/login' />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
