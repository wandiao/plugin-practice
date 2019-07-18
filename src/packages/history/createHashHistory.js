import {
  addLeadingSlash,
  stripLeadingSlash,
  stripTrailingSlash,
  stripBasename,
  createPath
} from './PathUtils'
import { createLocation, locationsAreEqual } from './LocationUtils'
import createTransitionManager from './createTransitionManager'

import {
  getConfirmation,
} from './DOMUtils'


function getHashPath() {
  // 不能直接使用window.location.hash，firefox会将hash进行编码
  const href = window.location.href
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

function pushHashPath(path) {
  window.location.hash = path
}

function replaceHashPath(path) {
  const hashIndex = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path
  )
}

const HashChangeEvent = 'hashchange'

// 不同的hashType
const HashPathCoders = {
  hashbang: {
    encodePath: path =>
      path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path),
    decodePath: path => (path.charAt(0) === '!' ? path.substr(1) : path)
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
}


function createHashHistory(props = {}) {
  const globalHistory = window.history
  const { getUserConfirmation = getConfirmation, hashType = 'slash' } = props
  const basename = props.basename
    ? stripTrailingSlash(addLeadingSlash(props.basename))
    : ''
  const initialLocation = getDOMLocation()
  const { encodePath, decodePath } = HashPathCoders[hashType]

  const transitionManager = createTransitionManager()

  let forceNextPop = false
  let ignorePath = null

  function getDOMLocation() {
    let path = decodePath(getHashPath())


    if (basename) path = stripBasename(path, basename)

    return createLocation(path)
  }

  function createHref(location) {
    return '#' + encodePath(basename + createPath(location))
  }

  function setState(nextState) {
    Object.assign(history, nextState)
    history.length = globalHistory.length
    transitionManager.notifyListeners(history.location, history.action)
  }

  function handleHashChange() {
    const path = getHashPath()
    const encodedPath = encodePath(path)

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath)
    } else {
      const location = getDOMLocation()
      const prevLocation = history.location

      if (!forceNextPop && locationsAreEqual(prevLocation, location)) return

      if (ignorePath === createPath(location)) return

      ignorePath = null

      handlePop(location)
    }
  }

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

  // 回滚path
  function revertPop(fromLocation) {
    const toLocation = history.location

    let toIndex = allPaths.lastIndexOf(createPath(toLocation))

    if (toIndex === -1) toIndex = 0

    let fromIndex = allPaths.lastIndexOf(createPath(fromLocation))

    if (fromIndex === -1) fromIndex = 0

    const delta = toIndex - fromIndex

    if (delta) {
      forceNextPop = true
      go(delta)
    }
  }

  let allPaths = [createPath(initialLocation)]

  function push(path, state) {
    
    const action = 'PUSH'
    const location = createLocation(
      path,
      undefined,
      undefined,
      history.location
    )
    transitionManager.confirmTransitionTo(
      location,
      action,
      getUserConfirmation,
      ok => {
        if (!ok) return

        const path = createPath(location)
        const encodedPath = encodePath(basename + path)
        const hashChanged = getHashPath() !== encodedPath

        if (hashChanged) {
          // 记录path,忽略重复的path
          ignorePath = path
          pushHashPath(encodedPath)

          const prevIndex = allPaths.lastIndexOf(createPath(history.location))
          const nextPaths = allPaths.slice(
            0,
            prevIndex === -1 ? 0 : prevIndex + 1
          )

          nextPaths.push(path)
          allPaths = nextPaths

          setState({ action, location })
        } else {
          console.err('同样的path不能push')

          setState()
        }
      }
    )
  }

  function replace(path, state) {

    const action = 'REPLACE'
    const location = createLocation(
      path,
      undefined,
      undefined,
      history.location
    )

    transitionManager.confirmTransitionTo(
      location,
      action,
      getUserConfirmation,
      ok => {
        if (!ok) return

        const path = createPath(location)
        const encodedPath = encodePath(basename + path)
        const hashChanged = getHashPath() !== encodedPath

        if (hashChanged) {
          // 记录path,忽略重复的path
          ignorePath = path
          replaceHashPath(encodedPath)
        }

        const prevIndex = allPaths.indexOf(createPath(history.location))

        if (prevIndex !== -1) allPaths[prevIndex] = path

        setState({ action, location })
      }
    )
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

  let listenerCount = 0

  function checkDOMListeners(delta) {
    listenerCount += delta

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(HashChangeEvent, handleHashChange)
    } else if (listenerCount === 0) {
      window.removeEventListener(HashChangeEvent, handleHashChange)
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

  function listen(listener) {
    const unlisten = transitionManager.appendListener(listener)
    checkDOMListeners(1)

    return () => {
      checkDOMListeners(-1)
      unlisten()
    }
  }

  const history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref,
    push,
    replace,
    goBack,
    goForward,
    go,
    block,
    listen,
  }
  return history
}

export default createHashHistory