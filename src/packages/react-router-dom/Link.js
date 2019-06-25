import React from "react"
import PropTypes from "prop-types"
import RouterContext from "@/react-router/RouterContext"
import { resolveToLocation, normalizeToLocation } from "./utils/locationUtils"

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

function LinkAnchor({ innerRef, navigate, onClick, ...rest }) {
  const { target } = rest

  return (
    <a
      {...rest}
      ref={innerRef}
      onClick={event => {
        try {
          if (onClick) onClick(event)
        } catch (ex) {
          event.preventDefault()
          throw ex
        }

        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          (!target || target === "_self") &&
          !isModifiedEvent(event)
        ) {
          event.preventDefault()
          navigate()
        }
      }}
    />
  )
}

/**
 * The public API for rendering a history-aware <a>.
 */
function Link({ replace, to, ...rest }) {
  return (
    <RouterContext.Consumer>
      {context => {

        const { history } = context


        // 统一处理to props => return object|string
        const location = normalizeToLocation(
          resolveToLocation(to, context.location),
          context.location
        )
        
        // 创建链接
        const href = location ? history.createHref(location) : ""

        return React.createElement(LinkAnchor, {
          ...rest,
          href,
          navigate() {
            const location = resolveToLocation(to, context.location)
            const method = replace ? history.replace : history.push
            method(location)
          }
        })
      }}
    </RouterContext.Consumer>
  )
}

Link.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  onClick: PropTypes.func,
  replace: PropTypes.bool,
  target: PropTypes.string,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func
  ]).isRequired
}

export default Link