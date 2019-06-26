import React, { Component } from 'react'
import { withRouter } from '@/react-router'

class RouterWrap extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        url: {this.props.location.pathname}
      </div>
    )
  }
}

export default withRouter(RouterWrap)
