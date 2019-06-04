import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import createStore from './redux/createStore';
import counter from './reducer/counter';
import Provider from './react-redux/components/Provider';
import Test from './Test';

 const store = createStore(counter, {
  count: 2
})



class App extends Component {
  constructor(props) {
    super(props)
    this._ref = React.createRef();
  }
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            <Test></Test>
          </header>
        </div>
      </Provider>
    );
  }
}

export default App;
