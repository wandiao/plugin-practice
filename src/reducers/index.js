import { combineReducers } from '../redux'

import todoReducer from './todo'
import countReducer from './counter'

const rootReducer = combineReducers({
  count: countReducer,
  todos:  todoReducer,
})

export default rootReducer