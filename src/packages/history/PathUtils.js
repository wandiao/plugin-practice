
/**
 * 转url字符串为对象
 * @param {*} path 
 */
export function parsePath(path) {
  let pathname = path || '/'
  let search = ''
  let hash = ''

  const hashIndex = pathname.indexOf('#')
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex)
    pathname = pathname.substr(0, hashIndex)
  }

  const searchIndex = pathname.indexOf('?')
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex)
    pathname = pathname.substr(0, searchIndex)
  }

  return {
    pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  }
}

/**
 * 去掉url结尾的"/"
 * @param {*} path 
 */
export function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path
}

/**
 * 添加url开头的"/"
 * @param {*} path 
 */
export function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path
}

/**
 * url是否带有指定的前缀
 * @param {*} path 
 * @param {*} prefix 
 */
export function hasBasename(path, prefix) {
  return (
    path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 &&
    '/?#'.indexOf(path.charAt(prefix.length)) !== -1
  )
}

/**
 * 去除url中的指定前缀
 * @param {*} path 
 * @param {*} prefix 
 */
export function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path
}


/**
 * 是否为绝对路径
 * @param {*} pathname 
 */
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/'
}

/**
 * 处理路径
 * @param {*} to 
 * @param {*} from 
 */
export function resolvePathname(to, from) {
  if (from === undefined) from = ''

  var toParts = (to && to.split('/')) || []
  var fromParts = (from && from.split('/')) || []

  var isToAbs = to && isAbsolute(to)
  var isFromAbs = from && isAbsolute(from)
  var mustEndAbs = isToAbs || isFromAbs

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop()
    fromParts = fromParts.concat(toParts)
  }

  if (!fromParts.length) return '/'

  var hasTrailingSlash
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1]
    hasTrailingSlash = last === '.' || last === '..' || last === ''
  } else {
    hasTrailingSlash = false
  }

  var up = 0
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i]

    if (part === '.') {
      fromParts.splice(i, 1)
    } else if (part === '..') {
      fromParts.splice(i, 1)
      up++
    } else if (up) {
      fromParts.splice(i, 1)
      up--
    }
  }

  if (!mustEndAbs) for (; up--; up) fromParts.unshift('..')

  if (
    mustEndAbs &&
    fromParts[0] !== '' &&
    (!fromParts[0] || !isAbsolute(fromParts[0]))
  )
    fromParts.unshift('')

  var result = fromParts.join('/')

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/'

  return result
}

/**
 * 根据location生成路径
 * @param {*} location 
 */
export function createPath(location) {
  const { pathname, search, hash } = location

  let path = pathname || '/'

  if (search && search !== '?')
    path += search.charAt(0) === '?' ? search : `?${search}`

  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : `#${hash}`

  return path
}
