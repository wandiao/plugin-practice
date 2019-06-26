import React, { Component } from 'react'
import RouterDemo from '../index'
import { Prompt } from '@/react-router'

export default class index extends Component {
  constructor(props) {
    super(props)
    this._input = React.createRef()
  }
  render() {
    console.log(this._input)
    return (
      <RouterDemo>
        <input ref={this._input} />
        <Prompt message='内容尚未保存，确认离开吗' when={!!(this._input.current && this._input.current.value)}>
          page1
        </Prompt>
      </RouterDemo>
    )
  }
}
