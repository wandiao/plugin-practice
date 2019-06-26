import React from "react"
import PropTypes from "prop-types"
import { createLocation, createPath } from "history"

import Router from "./Router"

function addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path
}

function addBasename(basename, location) {
  if (!basename) return location

  return {
    ...location,
    pathname: addLeadingSlash(basename) + location.pathname
  }
}

function stripBasename(basename, location) {
  if (!basename) return location

  const base = addLeadingSlash(basename)

  if (location.pathname.indexOf(base) !== 0) return location

  return {
    ...location,
    pathname: location.pathname.substr(base.length)
  }
}

function createURL(location) {
  return typeof location === "string" ? location : createPath(location)
}

function staticHandler(methodName) {
  return () => {
    console.error("You cannot %s with <StaticRouter>", methodName)
  }
}

function noop() {}

/**
 * 静态路由不会改变location, 用于服务端渲染
 */
class StaticRouter extends React.Component {
  navigateTo(location, action) {
    const { basename = "", context = {} } = this.props
    context.action = action
    context.location = addBasename(basename, createLocation(location))
    context.url = createURL(context.location)
  }

  handlePush = location => this.navigateTo(location, "PUSH");
  handleReplace = location => this.navigateTo(location, "REPLACE");
  handleListen = () => noop;
  handleBlock = () => noop;

  render() {
    const { basename = "", context = {}, location = "/", ...rest } = this.props

    const history = {
      createHref: path => addLeadingSlash(basename + createURL(path)),
      action: "POP",
      location: stripBasename(basename, createLocation(location)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      listen: this.handleListen,
      block: this.handleBlock
    }

    return <Router {...rest} history={history} staticContext={context} />
  }
}

StaticRouter.propTypes = {
  basename: PropTypes.string,
  context: PropTypes.object,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}

export default StaticRouter
