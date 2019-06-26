import React, { Component } from 'react'
import { Redirect } from '@/react-router'
import RouterDemo from '../index'

export default class index extends Component {
  render() {
    return (
      <RouterDemo>
        <Redirect to='/router-demo/page3'></Redirect>
      </RouterDemo>
    )
  }
}
