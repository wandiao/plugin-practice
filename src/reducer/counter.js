let initState = {
  count: 0
}

export default function counter(state = initState, action) {
  const count = state.count
  switch(action.type) {
    case 'INCREASE':
      return { count: count + 1 }
    case 'DECREASE':
      return { count: count - 1 }
    default:
      return state
  }
}