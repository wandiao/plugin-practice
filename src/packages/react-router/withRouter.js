import React from "react"
import RouterContext from "./RouterContext"
import hoistStatics from "hoist-non-react-statics"
import invariant from "tiny-invariant"

/**
 * 注入context props的高阶组件
 */
function withRouter(Component) {
  const displayName = `withRouter(${Component.displayName || Component.name})`
  const C = props => {
    const { forwardedRef, ...remainingProps } = props
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(
            context,
            `You should not use <${displayName} /> outside a <Router>`
          )
          return (
            <Component
              {...remainingProps}
              {...context}
              ref={forwardedRef}
            />
          )
        }}
      </RouterContext.Consumer>
    )
  }

  const forwarded = React.forwardRef((props, ref) => (
    <C {...props} forwardedRef={ref} />
  ))

  forwarded.displayName = displayName
  forwarded.WrappedComponent = Component


  return hoistStatics(forwarded, Component)
}

export default withRouter
