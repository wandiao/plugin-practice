import React, { Component } from 'react'
// import connect from './react-redux/connect/connect'

class Test2 extends Component {
  handler = () => {
    const { dispatch } = this.props
    console.log(1)
    dispatch({
      type: 'INCREASE'
    })
  }
  render() {
    return (
      <div>
        Test2
      </div>
    )
  }
}

export default Test2

