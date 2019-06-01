function noop() {

}
export function pureFinalPropsSelectorFactory(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  dispatch,
  { areStatesEqual, areOwnPropsEqual, areStatePropsEqual } = {}
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
  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce
    ? null // TODO:
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