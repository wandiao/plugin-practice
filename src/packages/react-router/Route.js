import React, { Component } from 'react'
import PropTypes from "prop-types"
import RouterContext from './RouterContext'
import matchPath from './matchPath'

function isEmptyChildren(children) {
  return React.Children.count(children) === 0
}

class Route extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {
          context => {
            const location = this.props.location || context.location
            const match = this.props.computedMatch
              ? this.props.computedMatch
              : this.props.path
                ? matchPath(location.pathname, this.props)
                : context.match

            const props = { ...context, location, match }
            let { children, component, render } = this.props

            if (typeof children === "function") {
              children = children(props)
              if (children === undefined) {
                const { path } = this.props
                console.warn(`<Route${path ? ` path="${path}"` : ""}>:children prop应该返回一个react元素或者null, 但是返回了undefined`)
                children = null
              }
            }

            return (
              <RouterContext.Provider value={props}>
                {
                  children && !isEmptyChildren(children)
                    ? children
                    : props.match
                      ? component
                        ? React.createElement(component, props)
                        : render
                          ? render(props)
                          : null
                      : null
                }
              </RouterContext.Provider>
            )
          }
        }
      </RouterContext.Consumer>
    )
  }
}

Route.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  exact: PropTypes.bool,
  location: PropTypes.object,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  render: PropTypes.func,
  sensitive: PropTypes.bool,
  strict: PropTypes.bool
}

export default Route