import React, { Component } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { getToken } from "./services/tokenService"
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

class App extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    this.getCurrentUser();
    // When the app loads, try and get the current user
  }

  setUser = user => {
    this.setState({ user });
  };

  getCurrentUser = () => {
    // 1. Try and retrieve the user's token
    const token = getToken();
    // 2. If they have a token, make a request to /user/current for their user details
    if (token) {
      axios.get('/user/current', {
    // 3. Pass the token as an Authorization Header
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
    // 4. If a successful response returns, store the user in state.
        if (res.status === 200) {
          const user = res.data.payload;
          this.setUser(user);
        }

      })
    }
  };
  render() {
    // 1. Add React-Router to control what view the user sees
    // 2. If there is an active user in state, send them to the dashboard.
    // 3. If there's no user, send them to the login screen.
    // 4. If a logged in user tries to hit the login screen, redirect them to the dashboard.
    return (
      <div className="App">
        <h1>Authentication App</h1>
        <Router>
        <div>
        <Switch>
          <Route 
            path="/login" 
            render={() => {
              if (this.state.user) {
                return <Redirect to="/" />
              } else {
                return <Login getCurrentUser={this.getCurrentUser}/>
              }
            }}
          />
          <Route 
            path="/signup" 
            render={() => {
              if (this.state.user) {
                return <Redirect to="/" />
              } else {
                return <Signup setUser={this.setUser} />
              }
            }}
          />
          <Route 
            path="/" 
            render={() => {
              if (this.state.user) {
                return <Dashboard setUser={this.setUser}/>
              } else {
                return <Redirect to="/login" />
              }
            }}
            />
          </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
