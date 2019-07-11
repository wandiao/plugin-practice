import React, { Component } from 'react'
import { createBrowserHistory } from '@/history'

const history = createBrowserHistory()

export default class index extends Component {
  push() {
    history.push({
      pathname: '/historyDemo/page2',
      search: '?a=1',
      hash: '#233',
      state: {
        b: 233
      },
    })
    console.log(history)
    console.log(window.history.state)
  }
  render() {
    return (
      <div>
        page1
        <button onClick={this.push}>push</button>
      </div>
    )
  }
}
