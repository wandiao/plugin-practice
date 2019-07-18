import React, { Component } from 'react'
import { Router } from '../react-router'
import { createHashHistory } from '@/history'


class HashRouter extends Component {
  history = createHashHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />
  }
}

export default HashRouter