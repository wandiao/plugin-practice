import { ADD, SUBTRACT } from '../actions/count';

const initialState = {
  count: 0
}

export default function countReducer(state = initialState, action) {
  switch(action.type) {
    case ADD:
      return {
        ...state,
        count: state.count + action.num
      }
    case SUBTRACT:
      return {
        ...state,
        count: state.count - action.num
      }
    default:
      return state
  }
}