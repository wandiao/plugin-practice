import { ADD, SUBTRACT } from '../actions/constants'

const initialState = 0

export default function countReducer(state = initialState, action) {
  switch(action.type) {
    case ADD:
      return state + action.num
    case SUBTRACT:
      return state - action.num
    default:
      return state
  }
}