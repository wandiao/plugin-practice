import React, { Component } from 'react'
import { connect } from '@/react-redux'

import CountWrap from '../components/CountWrap';
import { add, subtract } from '../actions/count';


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
  return state
}

export default connect(mapStateToProps)(CountContainer)
