import pathToRegexp from "path-to-regexp"

const cache = {}
const cacheLimit = 10000
let cacheCount = 0

/**
 * 
 * @param {*} path 
 */
function compilePath(path) {
  if (cache[path]) return cache[path]

  const generator = pathToRegexp.compile(path)

  if (cacheCount < cacheLimit) {
    cache[path] = generator
    cacheCount++
  }

  return generator
}

/**
 * 生成url pathname
 */
function generatePath(path = "/", params = {}) {
  return path === "/" ? path : compilePath(path)(params, { pretty: true })
}

export default generatePath
