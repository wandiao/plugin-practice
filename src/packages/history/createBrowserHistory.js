import { 
  supportsHistory,
  supportsPopStateOnHashChange,
  getConfirmation,
} from './DOMUtils'

import { createLocation } from './LocationUtils'
import createTransitionManager from './createTransitionManager'

import {
  addLeadingSlash,
  stripTrailingSlash,
  stripBasename,
  createPath,
} from './PathUtils'


function createBrowserHistory(props = {}) {
  const globalHistory = window.history
  const canUseHistory = supportsHistory()
  const needsHashChangeListener = !supportsPopStateOnHashChange()
  const transitionManager = createTransitionManager()
  const {
    forceRefresh = false,
    getUserConfirmation = getConfirmation,
    keyLength = 6
  } = props

  function createKey() {
    return Math.random()
      .toString(36)
      .substr(2, keyLength)
  }
  const basename = props.basename
    ? stripTrailingSlash(addLeadingSlash(props.basename))
    : ''

    function createHref(location) {
      return basename + createPath(location)
    }

    function go(n) {
      globalHistory.go(n)
    }
  
    function goBack() {
      go(-1)
    }
  
    function goForward() {
      go(1)
    }

    function setState(nextState) {
      Object.assign(history, nextState)
      history.length = globalHistory.length
      transitionManager.notifyListeners(history.location, history.action)
    }

    const initialLocation = getDOMLocation(window.history.state || {})
    let allKeys = [initialLocation.key]

    function push(path, state) {
  
      const action = 'PUSH'
      const location = createLocation(path, state, createKey(), history.location)
      
  
      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
          if (!ok) return
  
          const href = createHref(location)
          const { key, state } = location
  
          if (canUseHistory) {
            globalHistory.pushState({ key, state }, null, href)
  
            if (forceRefresh) {
              window.location.href = href
            } else {
              const prevIndex = allKeys.indexOf(history.location.key)
              const nextKeys = allKeys.slice(
                0,
                prevIndex === -1 ? 0 : prevIndex + 1
              )
  
              nextKeys.push(location.key)
              allKeys = nextKeys
  
              setState({ action, location })
            }
          } else {
  
            window.location.href = href
          }
        }
      )
    }

    function replace(path, state) {
  
      const action = 'REPLACE'
      const location = createLocation(path, state, createKey(), history.location)
  
      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
          if (!ok) return
  
          const href = createHref(location)
          const { key, state } = location
  
          if (canUseHistory) {
            globalHistory.replaceState({ key, state }, null, href)
  
            if (forceRefresh) {
              window.location.replace(href)
            } else {
              const prevIndex = allKeys.indexOf(history.location.key)
  
              if (prevIndex !== -1) allKeys[prevIndex] = location.key
  
              setState({ action, location })
            }
          } else {
            window.location.replace(href)
          }
        }
      )
    }

    let listenerCount = 0

    function checkDOMListeners(delta) {
      listenerCount += delta

      if (listenerCount === 1 && delta === 1) {
        window.addEventListener(PopStateEvent, handlePopState)

        if (needsHashChangeListener)
          window.addEventListener(HashChangeEvent, handleHashChange)
      } else if (listenerCount === 0) {
        window.removeEventListener(PopStateEvent, handlePopState)

        if (needsHashChangeListener)
          window.removeEventListener(HashChangeEvent, handleHashChange)
      }
    }

    function handlePopState(event) {
      handlePop(getDOMLocation(event.state))
    }

    function handleHashChange() {
      handlePop(getDOMLocation(window.history.state || {}))
    }

    let forceNextPop = false
    function handlePop(location) {
      if (forceNextPop) {
        forceNextPop = false
        setState()
      } else {
        const action = 'POP'
  
        transitionManager.confirmTransitionTo(
          location,
          action,
          getUserConfirmation,
          ok => {
            if (ok) {
              setState({ action, location })
            } else {
              revertPop(location)
            }
          }
        )
      }
    }

    // 回滚操作
    function revertPop(fromLocation) {
      const toLocation = history.location
  
  
      let toIndex = allKeys.indexOf(toLocation.key)
  
      if (toIndex === -1) toIndex = 0
  
      let fromIndex = allKeys.indexOf(fromLocation.key)
  
      if (fromIndex === -1) fromIndex = 0
  
      const delta = toIndex - fromIndex
  
      if (delta) {
        forceNextPop = true
        go(delta)
      }
    }

    function getDOMLocation(historyState) {
      const { key, state } = historyState || {}
      const { pathname, search, hash } = window.location
  
      let path = pathname + search + hash
  
  
      if (basename) path = stripBasename(path, basename)
  
      return createLocation(path, state, key)
    }

    function listen(listener) {
      const unlisten = transitionManager.appendListener(listener)
      checkDOMListeners(1)
  
      return () => {
        checkDOMListeners(-1)
        unlisten()
      }
    }

    let isBlocked = false

    function block(prompt = false) {
      const unblock = transitionManager.setPrompt(prompt)

      if (!isBlocked) {
        checkDOMListeners(1)
        isBlocked = true
      }

      return () => {
        if (isBlocked) {
          isBlocked = false
          checkDOMListeners(-1)
        }

        return unblock()
      }
    }

  
  
  const history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref,
    go,
    goBack,
    goForward,
    push,
    replace,
    listen,
    block,

  }
  return history
  
}


export default createBrowserHistory