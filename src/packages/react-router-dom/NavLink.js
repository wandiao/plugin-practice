import React from "react"
import { __RouterContext as RouterContext, matchPath } from "@/react-router"
import PropTypes from "prop-types"
import Link from "./Link"
import { resolveToLocation, normalizeToLocation } from "./utils/locationUtils"

function joinClassnames(...classnames) {
  return classnames.filter(i => i).join(" ")
}

/**
 * 知道自己是否被激活的<link>组件
 */
function NavLink({
  "aria-current": ariaCurrent = "page",
  activeClassName = "active",
  activeStyle,
  className: classNameProp,
  exact,
  isActive: isActiveProp,
  location: locationProp,
  strict,
  style: styleProp,
  to,
  ...rest
}) {
  return (
    <RouterContext.Consumer>
      {context => {

        const currentLocation = locationProp || context.location
        const { pathname: pathToMatch } = currentLocation
        // 统一处理to props => return object|string
        const toLocation = normalizeToLocation(
          resolveToLocation(to, currentLocation),
          currentLocation
        )
        const { pathname: path } = toLocation
        // 对path进行转义，用于当做正则表达式进行匹配 /a/b/c -> \/a\/b
        const escapedPath =
          path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1")

        const match = escapedPath
          ? matchPath(pathToMatch, { path: escapedPath, exact, strict })
          : null
        const isActive = !!(isActiveProp
          ? isActiveProp(match, context.location)
          : match)

        const className = isActive
          ? joinClassnames(classNameProp, activeClassName)
          : classNameProp
        const style = isActive ? { ...styleProp, ...activeStyle } : styleProp

        return (
          <Link
            aria-current={(isActive && ariaCurrent) || null}
            className={className}
            style={style}
            to={toLocation}
            {...rest}
          />
        )
      }}
    </RouterContext.Consumer>
  )
}

const ariaCurrentType = PropTypes.oneOf([
  "page",
  "step",
  "location",
  "date",
  "time",
  "true"
])

NavLink.propTypes = {
  ...Link.propTypes,
  "aria-current": ariaCurrentType,
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  className: PropTypes.string,
  exact: PropTypes.bool,
  isActive: PropTypes.func,
  location: PropTypes.object,
  strict: PropTypes.bool,
  style: PropTypes.object
}

export default NavLink
