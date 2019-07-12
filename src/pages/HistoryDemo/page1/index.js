import React, { Component } from 'react'

export default class index extends Component {
  push() {
    const { history } = this.props
    console.log(history.length)
    history.push({
      pathname: '/history-demo/page2',
      search: '?a=1',
      hash: '#233',
      state: {
        b: 233
      },
    })
    console.log(history.length)
  }
  render() {
    return (
      <div>
        page1
        <button onClick={this.push.bind(this)}>push</button>
      </div>
    )
  }
}
