import React, { Component } from 'react'
import CountWrap from '../components/CountWrap';
import { add, subtract } from '../actions/count';
import connect from '../react-redux/connect/connect'

class CountContainer extends Component {
  render() {
    return (
      <div>
        <CountWrap 
          count={this.props.count}
          onAdd={() => this.props.dispatch(add())}
          onSubtract={() => this.props.dispatch(subtract())}
        >

        </CountWrap>
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return state
}

export default connect(mapStateToProps)(CountContainer)
