import React, { Component } from 'react'
import  { BrowserRouter as Router, Route, Link } from '@/react-router-dom'
import './App.scss'

import routes from './routes'



class App extends Component {
  render() {
    return (
      <div className="App">
          <Router>
            <nav>
              <Link to='/redux-demo'>redux-demo</Link>
              <Link to='/router-demo'>router-demo</Link>
            </nav>
            {/* demo */}
            {
              routes.map(c => (
                <Route key={c.path} path={c.path} component={c.component}></Route>
              ))
            }
          </Router>
        
      </div>
    )
  }
}

export default App
