import React, { Component } from 'react'
import  { BrowserRouter as Router, Route, Link, Switch } from '@/react-router-dom'

import './App.scss'

import NoMatch from './pages/NoMatch'
import routes from './routes'



class App extends Component {
  render() {
    return (
      <div className="App">
          <Router>
            <nav>
              <Link to='/redux-demo'>redux-demo</Link>
              <Link to='/router-demo'>router-demo</Link>
              <Link to='/sakldfjlkjflqwk/qlwejkqlwje'>no match page</Link>
            </nav>
            {/* demo */}
            <Switch>
              {
                routes.map(c => (
                  <Route exact={c.exact} key={c.path} path={c.path} component={c.component}></Route>
                ))
              }
              <Route component={NoMatch} />
            </Switch>
          </Router>
        
      </div>
    )
  }
}

export default App
