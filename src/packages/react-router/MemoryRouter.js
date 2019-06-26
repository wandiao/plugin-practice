import React from "react"
import PropTypes from "prop-types"
import { createMemoryHistory } from "history"

import Router from "./Router"

/**
 *内存路由
 */
class MemoryRouter extends React.Component {
  history = createMemoryHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />
  }
}

MemoryRouter.propTypes = {
  initialEntries: PropTypes.array,
  initialIndex: PropTypes.number,
  getUserConfirmation: PropTypes.func,
  keyLength: PropTypes.number,
  children: PropTypes.node
}

export default MemoryRouter
