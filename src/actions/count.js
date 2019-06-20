import { ADD, SUBTRACT } from './constants'
// action对象
// {
//   type: ADD,
//   num: 10
// }

// 使用Action创建函数，动态创建action
export function add(num = 1) {
  return {
    type: ADD,
    num,
  }
}

export function subtract(num = 1) {
  return {
    type: SUBTRACT,
    num,
  }
}