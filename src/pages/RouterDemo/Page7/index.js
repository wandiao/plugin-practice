import React, { Component } from 'react'
import RouterDemo from '../index'

export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //这里直接判断window，如果是父组件传入的话，通过props判断
      initData: window.__INITIAL_DATA__ || [],
    }
  }
  render() {
    return (
      <RouterDemo>
        {this.state.initData.foo || '--'}
      </RouterDemo>
    )
  }
}
