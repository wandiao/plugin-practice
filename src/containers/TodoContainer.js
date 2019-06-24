import React, { Component } from 'react'
import { connect } from '@/react-redux'

import Todo from '../components/Todo';
import { addTodo,toggleTodo } from '../actions/todo';



class TodoContainer extends Component {
  constructor(props) {
    super(props)
    this.input = React.createRef()
  }
  render() {
    const { dispatch } = this.props
    return (
      <div>
        <div className='form-box'>
          <input ref={this.input}></input>
          <button onClick={() => {
            if (!this.input.current.value.trim()) {
              return
            }
            dispatch(addTodo(this.input.current.value))
            this.input.current.value = ''
          }}>添加todo</button>
        </div>
        <ul>
          {
            this.props.todos.map(todo => (
              <Todo key={todo.id} {...todo} onClick={() => dispatch(toggleTodo(todo.id))} />
            ))
          }
        </ul>
      </div>
      
    )
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(TodoContainer)
