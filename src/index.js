import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Provider from './react-redux/components/Provider';
import createStore from './redux/createStore';
import applyMiddleware from './redux/applyMiddleware';


import reducers from './reducers/index';
import middleware1 from './utils/middleware1'
import middleware2 from './utils/middleware2'

const store = createStore(reducers, {
  count: 0,
  todos: [],
}, applyMiddleware(middleware1, middleware2))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
