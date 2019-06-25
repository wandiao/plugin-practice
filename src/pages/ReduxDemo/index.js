import React, { Component } from 'react'

import CountContainer from './CountContainer'
import TodoContainer from './TodoContainer'

export default class index extends Component {
  render() {
    return (
      <div>
        <CountContainer />
        <TodoContainer />
      </div>
    )
  }
}
