import React, { Component } from 'react'
import { Router } from '../react-router'
import { createBrowserHistory } from 'history';


class BrowserRouter extends Component {
  history = createBrowserHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default BrowserRouter