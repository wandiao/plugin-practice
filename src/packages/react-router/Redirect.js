import React from 'react'
import PropTypes from "prop-types"
import RouterContext from "./RouterContext"
import { createLocation, locationsAreEqual } from "history"
import generatePath from "./generatePath"
import Lifecycle from './Lifecycle'

function Redirect({ computedMatch, to, push = false }) {
  return (
    <RouterContext.Consumer>
      {context => {
        if (!context) {
          throw new Error('不能在<Router/>外使用<Redirect/>')
        }

        const { history, staticContext } = context

        const method = push ? history.push : history.replace
        const location = createLocation(
          computedMatch
            ? typeof to === "string"
              ? generatePath(to, computedMatch.params)
              : {
                  ...to,
                  pathname: generatePath(to.pathname, computedMatch.params)
                }
            : to
        )

        // 静态路由直接跳转至相应URL不会继续更新
        if (staticContext) {
          method(location)
          return null
        }

        return (
          <Lifecycle
            onMount={() => {
              method(location)
            }}
            onUpdate={(self, prevProps) => {
              const prevLocation = createLocation(prevProps.to)
              // 如果不是同一个location,跳转到相应location
              if (
                !locationsAreEqual(prevLocation, {
                  ...location,
                  key: prevLocation.key
                })
              ) {
                method(location)
              }
            }}
            to={to}
          />
        )
      }}
    </RouterContext.Consumer>
  )
}

Redirect.propTypes = {
  push: PropTypes.bool,
  from: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default Redirect