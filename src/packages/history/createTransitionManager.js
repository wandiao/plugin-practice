function createTransitionManager() {
  let prompt = null

  function setPrompt(nextPrompt) {

    prompt = nextPrompt

    return () => {
      if (prompt === nextPrompt) prompt = null
    }
  }

  function confirmTransitionTo(
    location,
    action,
    getUserConfirmation,
    callback
  ) {
    if (prompt != null) {
      const result =
        typeof prompt === 'function' ? prompt(location, action) : prompt

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback)
        } else {

          callback(true)
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false)
      }
    } else {
      callback(true)
    }
  }

  let listeners = []

  function appendListener(fn) {
    let isActive = true

    function listener(...args) {
      if (isActive) fn(...args)
    }

    listeners.push(listener)

    return () => {
      isActive = false
      listeners = listeners.filter(item => item !== listener)
    }
  }

  function notifyListeners(...args) {
    listeners.forEach(listener => listener(...args))
  }

  return {
    setPrompt,
    confirmTransitionTo,
    appendListener,
    notifyListeners
  }
}

export default createTransitionManager
