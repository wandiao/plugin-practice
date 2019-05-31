import React, { Component } from 'react'
import { MainContext } from './Context';


class Provider extends Component {
  constructor(props) {
    super(props)
    const store = this.props
    this.state = {
      store
    }
  }

  render() {
    const Context = this.props.context || MainContext
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default Provider