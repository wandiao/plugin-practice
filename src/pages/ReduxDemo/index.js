import React, { Component } from 'react'

import CountContainer from './CountContainer'
import TodoContainer from './TodoContainer'

import './index.scss'

export default class index extends Component {
  render() {
    return (
      <div className='redux-demo'>
        <CountContainer />
        <TodoContainer />
      </div>
    )
  }
}
