import React, { Component } from 'react'
import { MainContext } from './Context'
import Subscription from '../utils/Subscription';


class Provider extends Component {
  constructor(props) {
    super(props)
    const store = this.props.store
    const subscription = new Subscription(store)
    this.notifySubscribers = this.notifySubscribers.bind(this)
    subscription.onStateChange = this.notifySubscribers
    this.state = {
      store,
      subscription,
    }
    this.previousState = store.getState()
  }

  componentDidMount() {
    this.state.subscription.trySubscribe()
    if (this.previousState !== this.props.store.getState()) {
      console.log('store state 变化')
      this.state.subscription.notifyNestedSubs()
    }
  }

  componentWillUnmount() {
    this.state.subscription.tryUnsubscribe()
  }

  notifySubscribers() {
    this.state.subscription.notifyNestedSubs()
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