import shallowEqual from "../utils/shallowEqual"


function noop() {}
function strictEqual(a, b) {
  return a === b
}
export function pureFinalPropsSelectorFactory(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  dispatch,
) {
  let hasRunAtLeastOnce = false
  let ownProps
  let state
  let stateProps
  let dispatchProps
  let mergedProps

  // 合并注入组件
  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState
    ownProps = firstOwnProps
    stateProps = mapStateToProps(state, ownProps)
    dispatchProps = mapDispatchToProps(dispatch, ownProps)
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    hasRunAtLeastOnce = true
    return mergedProps
  }

  // store state和prop都发生变化
  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps)

    if (mapDispatchToProps.dependsOnOwnProps)
      dispatchProps = mapDispatchToProps(dispatch, ownProps)

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    return mergedProps
  }

  // 只改变props
  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps)
      stateProps = mapStateToProps(state, ownProps)

    if (mapDispatchToProps.dependsOnOwnProps)
      dispatchProps = mapDispatchToProps(dispatch, ownProps)

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    return mergedProps
  }

  // 只改变store state
  function handleNewState() {
    const nextStateProps = mapStateToProps(state, ownProps)
    const statePropsChanged = !strictEqual(nextStateProps, stateProps)
    stateProps = nextStateProps

    if (statePropsChanged)
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps)
    return mergedProps
  }

  // store发生变化的时候
  function handleSubsequentCalls(nextState, nextOwnProps) {
    const propsChanged = !shallowEqual(nextOwnProps, ownProps)
    const stateChanged = !strictEqual(nextState, state)
    state = nextState
    ownProps = nextOwnProps

    if (propsChanged && stateChanged) return handleNewPropsAndNewState()
    if (propsChanged) return handleNewProps()
    if (stateChanged) return handleNewState()
    return mergedProps
  }
  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce
    ? handleSubsequentCalls(nextState, nextOwnProps)
    : handleFirstCall(nextState, nextOwnProps)
  }
}

export default function finalPropsSelectorFactory(dispatch, {
  initMapStateToProps,
  initMapDispatchToProps,
  initMergeProps,
  ...options
}) {

  const mapStateToProps = initMapStateToProps(dispatch, options) || noop
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options) || noop
  const mergeProps = initMergeProps(dispatch, options) || noop
  // TODO:
  const selectorFactory = pureFinalPropsSelectorFactory
  return selectorFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    dispatch,
    options
  )
}