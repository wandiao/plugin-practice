import { parsePath, resolvePathname } from './PathUtils'

export function createLocation(path, state, key, currentLocation) {
  let location
  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path)
    location.state = state
  } else {
    // One-arg form: push(location)
    location = { ...path }

    if (location.pathname === undefined) location.pathname = ''

    if (location.search) {
      if (location.search.charAt(0) !== '?')
        location.search = '?' + location.search
    } else {
      location.search = ''
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash
    } else {
      location.hash = ''
    }

    if (state !== undefined && location.state === undefined)
      location.state = state
  }

  if (key) location.key = key

  if (currentLocation) {
    // 处理相对路径和绝对路径
    if (!location.pathname) {
      location.pathname = currentLocation.pathname
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(
        location.pathname,
        currentLocation.pathname
      )
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/'
    }
  }

  return location
}

/**
 * 比较两个值是否相等
 * @param {*} a 
 * @param {*} b 
 */
function valueEqual(a, b) {
  
  if (a === b) return true

  if (a == null || b == null) return false

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every(function(item, index) {
        return valueEqual(item, b[index])
      })
    )
  }

  if (typeof a === 'object' || typeof b === 'object') {
    var aValue = valueOf(a)
    var bValue = valueOf(b)

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue)

    return Object.keys(Object.assign({}, a, b)).every(function(key) {
      return valueEqual(a[key], b[key])
    })
  }

  return false
}

export function locationsAreEqual(a, b) {
  return (
    a.pathname === b.pathname &&
    a.search === b.search &&
    a.hash === b.hash &&
    a.key === b.key &&
    valueEqual(a.state, b.state)
  )
}