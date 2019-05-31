import { batch } from './batch'

// 一个空的监听器
const nullListeners = { notify() {} }

/**
 * 订阅
 */
export default class Subscription {
  constructor(store) {
    this.store = store
    this.unsubscribe = null
    this.listeners = nullListeners
  }

  notifyNestedSubs() {
    this.listeners.notify()
  }
  handleChangeWrapper = () => {
    console.log('通知')
    if (this.onStateChange) {
      this.onStateChange()
    }
  }


  trySubscribe() {
    if (!this.unsubscribe) {
      this.store.subscribe(this.handleChangeWrapper)
    }
  }
  tryUnsubscribe() {
    console.log('取消监听器')
  }
}
