import React, { Component } from 'react'
import PropTypes from "prop-types"
import RouterContext from './RouterContext'

class Router extends Component {
  static computeRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" }
  }
  constructor(props) {
    super(props)
    this.state = {
      location: props.history.location
    }
    this._isMounted = false
    this._pendingLocation = null
    if (!props.staticContext) {
      this.unlisten = props.history.listen(location => {
        if (this._isMounted) {
          this.setState({ location })
        } else {
          this._pendingLocation = location
        }
      })
    }
  }

  componentDidMount() {
    this._isMounted = true
    if (this._pendingLocation) {
      this.setState({ location: this._pendingLocation })
    }
  }

  componentWillUnmount() {
    if (this.unlisten) this.unlisten()
  }

  render() {
    return (
      <RouterContext.Provider
        children={this.props.children || null}
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }}
      />
    )
  }
}

Router.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
  staticContext: PropTypes.object
}

export default Router