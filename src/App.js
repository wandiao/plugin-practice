import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CountContainer from './containers/CountContainer';
import TodoContainer from './containers/TodoContainer';




class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <CountContainer />
          <TodoContainer />
        </header>
      </div>
    );
  }
}

export default App;
