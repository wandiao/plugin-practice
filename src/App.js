import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Test from './Test';
import CountContainer from './containers/CountContainer';




class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <CountContainer />
          <Test></Test>
        </header>
      </div>
    );
  }
}

export default App;
