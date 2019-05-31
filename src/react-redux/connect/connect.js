import React, { Component } from 'react';
import MainContext from '../components/Context';

export default function connect(mapState, mapDispatch) {
  return function wrapWithConnect(WrappedComponent) {
    return class extends Component {
      constructor(props) {
        super(props)
        this.state = {}
      }
      static contextType = MainContext
      render() {
        const state = this.context.store.store.getState()
        const dispatch = this.context.store.store.dispatch
        return (
          <WrappedComponent dispatch={dispatch} {...state} {...this.props}></WrappedComponent>
        )
      }
    }
  }
}