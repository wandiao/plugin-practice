import React, { Component } from 'react'
import { createBrowserHistory } from '@/history'

const history = createBrowserHistory()

export default class index extends Component {
  push() {
    console.log(history)
  }
  render() {
    return (
      <div>
        page2
        <button onClick={this.push}>push</button>
      </div>
    )
  }
}
