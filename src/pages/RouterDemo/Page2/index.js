import React, { Component } from 'react'
import RouterDemo from '../index'

export default class index extends Component {
  render() {
    const { match } = this.props
    return (
      <RouterDemo>
        id : {match.params.id}
      </RouterDemo>
    )
  }
}