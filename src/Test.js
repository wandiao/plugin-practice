import React, { Component } from 'react'
import connect from './react-redux/connect/connect'
import Test2 from './Test2';

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: true
    }
  }
  handler = () => {
    const { dispatch } = this.props
    console.log(1)
    dispatch({
      type: 'INCREASE'
    })
  }
  toggleShow = () => {
    this.setState(ps => ({
      show: !ps.show
    }))
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <p>{this.props.count}</p>
        <button onClick={this.handler}>增加</button>
        {this.state.show && <Test2></Test2>}
        <button onClick={this.toggleShow}>测试willUnmount</button>
      </div>
    )
  }
}

export default connect()(Test)

