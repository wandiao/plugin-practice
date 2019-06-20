import compose from './compose';


export default function applyMiddleware(middlewares) {
  return createStore => (...arg) => {
    const store = createStore(...arg)
    let dispatch = () => {
      throw new Error(
        '构建中间件的时候不允许dispatch'
      )
    }
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
}