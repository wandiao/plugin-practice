import { getBatch } from './batch'

// 一个空的监听器
const nullListeners = { notify() {} }
const CLEARED = null

function createListenerCollection() {
  const batch = getBatch()
  // the current/next pattern is copied from redux's createStore code.
  // TODO: refactor+expose that code to be reusable here?
  let current = []
  let next = []

  return {
    clear() {
      next = CLEARED
      current = CLEARED
    },

    notify() {
      const listeners = (current = next)
      batch(() => {
        for (let i = 0; i < listeners.length; i++) {
          listeners[i]()
        }
      })
    },

    get() {
      return next
    },

    subscribe(listener) {
      let isSubscribed = true
      if (next === current) next = current.slice()
      next.push(listener)

      return function unsubscribe() {
        if (!isSubscribed || current === CLEARED) return
        isSubscribed = false

        if (next === current) next = current.slice()
        next.splice(next.indexOf(listener), 1)
      }
    }
  }
}

/**
 * 订阅
 */
export default class Subscription {
  constructor(store, parentSub) {
    this.store = store
    this.parentSub = parentSub
    this.unsubscribe = null
    this.listeners = nullListeners
  }

  addNestedSub(listener) {
    this.trySubscribe()
    return this.listeners.subscribe(listener)
  }

  notifyNestedSubs() {
    this.listeners.notify()
  }
  handleChangeWrapper = () => {
    if (this.onStateChange) {
      this.onStateChange()
    }
  }


  trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.handleChangeWrapper) : this.store.subscribe(this.handleChangeWrapper)
      this.listeners = createListenerCollection()
    }
  }
  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
      this.listeners.clear()
      this.listeners = nullListeners
    }
  }
}
