import connectAdvanced from '../components/connectAdvanced'
import defaultSelectorFactory from './selectorFactory'
import defaultMapStateToPropsFactories from './mapStateToProps'


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
  mapStateToPropsFactories = defaultMapStateToPropsFactories
  
} = {}) {
  return function connect(mapStateToProps = null, mapDispatchToProps, mergeProps, options = {}) {
    return connectHOC(selectorFactory, {
      methodName: 'connect',
      initMapStateToProps: () => {},
      getDisplayName: name => `Connect(${name})`,
      initMapDispatchToProps: () => {},
      initMergeProps: () => {}
    })
  }
}

export default createConnect()