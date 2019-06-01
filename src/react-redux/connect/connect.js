import connectAdvanced from '../components/connectAdvanced'
import defaultSelectorFactory from './selectorFactory'
import defaultMapStateToPropsFactories from './mapStateToProps'
import defaultMapDispatchToPropsFactories from './mapDispatchToProps'
import defaultMergePropsFactories from './mergeProps'


function match(arg, factories, name) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg)
    if (result) return result
  }

  return (dispatch, options) => {
    throw new Error(
      `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${
        options.wrappedComponentName
      }.`
    )
  }
}

export function createConnect({
  connectHOC = connectAdvanced,
  selectorFactory = defaultSelectorFactory,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories
} = {}) {
  return function connect(mapStateToProps = null, mapDispatchToProps, mergeProps, options = {
    pure: true,
  }) {
    const initMapStateToProps = match(
      mapStateToProps,
      mapStateToPropsFactories,
      'mapStateToProps'
    )

    const initMapDispatchToProps = match(
      mapDispatchToProps,
      mapDispatchToPropsFactories,
      'mapDispatchToProps'
    )

    const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps')
    return connectHOC(selectorFactory, {
      methodName: 'connect',
      initMapStateToProps,
      getDisplayName: name => `Connect(${name})`,
      initMapDispatchToProps: () => {},
      initMergeProps,
      initMapDispatchToProps,
    })
  }
}

export default createConnect()