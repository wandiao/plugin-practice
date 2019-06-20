export default ({ getState, dispatch }) => next => action => {
  console.log(dispatch, 'middleware2')
  return next(action)
}