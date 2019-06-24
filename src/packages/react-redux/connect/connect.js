import connectAdvanced from './connectAdvanced'
import selectorFactory from './selectorFactory'
import mapStateToPropsFactories from './mapStateToProps'
import mapDispatchToPropsFactories from './mapDispatchToProps'
import mergePropsFactories from './mergeProps'


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


export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, {
  pure = true,
  ...extraOptions
} = {}) {

  // wrapMapToProps.js -> initProxySelector 
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
  
  return connectAdvanced(selectorFactory, {
    methodName: 'connect',
    getDisplayName: name => `Connect(${name})`,
    // 如果定义了mapStateToProps即监听store变化
    shouldHandleStateChanges: Boolean(mapStateToProps),
    initMapStateToProps,
    initMergeProps,
    initMapDispatchToProps,
    pure,
    ...extraOptions,
  })
}