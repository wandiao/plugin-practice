import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from '@/react-redux'
import { BrowserRouter } from '@/react-router-dom'
import { createStore, applyMiddleware } from '@/redux'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'



import reducers from './reducers/index'
import middleware1 from './utils/middleware1'
import middleware2 from './utils/middleware2'

const store = createStore(reducers, {
  count: 0,
  todos: [],
}, applyMiddleware(middleware1, middleware2))

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
