import React, { Component } from "react"
import { Route, Link, Switch } from "@/react-router-dom"

import "./App.scss"

import NoMatch from "./pages/NoMatch"
import routes from "./routes"

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav>
          <Link to="/redux-demo">redux-demo</Link>
          <Link to="/router-demo">router-demo</Link>
          <Link to="/sakldfjlkjflqwk/qlwejkqlwje">no match page</Link>
          <div>{this.props.initData && this.props.initData.foo}</div>
        </nav>
        {/* demo */}
        <Switch>
          {routes.map(c => (
            <Route
              exact={c.exact}
              key={c.path}
              path={c.path}
              component={c.component}
            />
          ))}
          <Route component={NoMatch} />
        </Switch>
      </div>
    )
  }
}

export default App
