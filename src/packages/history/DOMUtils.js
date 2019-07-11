
/**
 * 是否支持h5 history API
 */
export function supportsHistory() {
  const ua = window.navigator.userAgent

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  )
    return false

  return window.history && 'pushState' in window.history
}


/**
 * hash改变是否会触发popstate
 */
export function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1
}

/**
 * comfirm
 * @param {*} message 
 * @param {*} callback 
 */
export function getConfirmation(message, callback) {
  callback(window.confirm(message))
}