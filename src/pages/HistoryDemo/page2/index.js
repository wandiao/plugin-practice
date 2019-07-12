import React, { Component } from 'react'
import { createBrowserHistory } from '@/history'

const history = createBrowserHistory()

export default class index extends Component {
  replace() {
    const { history } = this.props
    console.log(history.length)
    history.replace({
      pathname: '/history-demo/page1',
    })
    console.log(history.length)

  }
  render() {
    return (
      <div>
        page2
        <button onClick={this.replace.bind(this)}>replace</button>
      </div>
    )
  }
}
