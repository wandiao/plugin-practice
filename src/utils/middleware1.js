export default ({ getState, dispatch }) => next => action => {
  console.log(getState(), 'middleware1')
  return next(action)
}