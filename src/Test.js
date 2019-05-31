import React, { Component } from 'react'
import connect from './react-redux/connect/connect'

class Test extends Component {
  handler = () => {
    const { dispatch } = this.props
    console.log(1)
    dispatch({
      type: 'INCREASE'
    })
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <p>{this.props.count}</p>
        <button onClick={this.handler}>增加</button>
      </div>
    )
  }
}

export default connect()(Test)

