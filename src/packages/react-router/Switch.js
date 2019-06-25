import React, { Component } from 'react'
import PropTypes from "prop-types"

import RouterContext from "./RouterContext"
import matchPath from "./matchPath"

/**
 * 选择显示的路由，显示第一个匹配的route或者redirect
 */
class Switch extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {
          context => {
            const location = this.props.location || context.location
            let element, match

            React.Children.forEach(this.props.children, child => {
              // 匹配成功不再继续匹配
              if (match == null && React.isValidElement(child)) {
                element = child
  
                const path = child.props.path || child.props.from
  
                match = path
                  ? matchPath(location.pathname, { ...child.props, path })
                  : context.match
              }
            })


            return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null
          }
        }
      </RouterContext.Consumer>
    )
  }
}

Switch.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object
}

export default Switch