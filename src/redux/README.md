# redux
>引用官方的描述， `Redux` 是 JavaScript 状态容器，提供可预测化的状态管理。[官方文档](http://cn.redux.js.org/)

以`react`为例，当你的应用随着组件层级和数量的增多，组件间状态的管理会变得越来越难以维护。而redux正是为了解决这一问题。它把组件的状态统一维护成一个状态树，任何state的改变都通过redux提供的方法来触发，使得state的变化变得可预测。当用户在view中操作的时候，会触发相应的行为(**action**)，同时在应用中还指定了相应的规则，根据不同的行为来决定如何改变state的值(**reducer**)，然后通过一个控制中心(**store**)来对行为按照规则进行调度(**dispatch**)，从来改变控制中心的state。


<div align="center">
  <img src="https://wj-block.oss-cn-shenzhen.aliyuncs.com/395937-20160710165110983-595754985.png" />
</div>

### 用法
```js
/**
 * actions/count.js
 */
export const ADD = 'ADD' // 增加
export const SUBTRACT = 'SUBTRACT' // 减少

// action对象
// {
//   type: ADD,
//   num: 10
// }

// 使用Action创建函数，动态创建action
export function add(num) {
  return {
    type: ADD,
    num,
  }
}

export function subtract(num) {
  return {
    type: SUBTRACT,
    num,
  }
}

/**
 * reducers/counter.js
 */
// 根据action决定如何改变count的值
import { ADD, SUBTRACT } from '../actions/count';

// 初始状态
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

/**
 * store
 * getState: 获取store的state
 * dispatch: 更新state
 * subscribe: 注册监听器
 */

import { createStore } from 'redux'
import counter from './reducers/counter'
let store = createStore(counter, {
  count: 0,
})

// 注册监听器， 返回一个注销监听器的函数
const unsubscribe = store.subscribe(() => console.log(store.getState()))

store.dispatch(add(10))
store.dispatch(add(15))
store.dispatch(subtract(20))

// 停止监听 state 更新
unsubscribe()


```

## API

- [x] createStore
- [x] compose
- [x] combineReducers
- [x] applyMiddleware
- [x] bindActionCreators

