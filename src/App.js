import React, { Component } from 'react';
import logo from './logo.svg';
import  { Router, Route } from '@/react-router';
import './App.css';
import CountContainer from './containers/CountContainer';
import TodoContainer from './containers/TodoContainer';
import { createBrowserHistory } from 'history';

import routerDemoRoutes from './pages/RouterDemo/routes'

const history = createBrowserHistory()




class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <CountContainer />
          <TodoContainer />
          <Router history={history}>
            {/* react-router demo */}
            {
              routerDemoRoutes.map(c => (
                <Route key={c.path} path={`/router-demo/${c.path}`} component={c.component}></Route>
              ))
            }
          </Router>
        </header>
      </div>
    );
  }
}

export default App;
