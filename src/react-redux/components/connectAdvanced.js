import React, { useMemo, useContext, useLayoutEffect, useEffect }  from 'react'
import MainContext from './Context';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect

export default function connectAdvanced(selectorFactory, {
  context = MainContext,
  getDisplayName = name => `ConnectAdvanced(${name})`,
  ...connectOptions
} = {}) {
  const Context = context
  return function wrapConnect(WrappedComponent) {
    const selectorFactoryOptions = {
      ...connectOptions,

    }

    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component'
    const displayName = getDisplayName(wrappedComponentName)
    const { pure } = connectOptions
    function createChildSelector(store) {
      return selectorFactory(store.dispatch, selectorFactoryOptions)
    }

    // 是否是纯函数组件
    const usePureOnlyMemo = pure ? useMemo : callback => callback()
    function ConnectFunction(props) {
      const [propsContext, forwardedRef, wrapperProps] = useMemo(() => {
        const { forwardedRef, ...wrapperProps } = props
        return [props.context, forwardedRef, wrapperProps]
      }, [props])
      const ContextToUse = useMemo(() => {
          return propsContext &&
            propsContext.Consumer
            ? propsContext
            : Context
        }, [propsContext])
        const contextValue = useContext(ContextToUse)

        const didStoreComeFromProps = Boolean(props.store)
        const didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store)
        console.log(didStoreComeFromProps, didStoreComeFromContext)
        const store = props.store || contextValue.store

        const childPropsSelector = useMemo(() => {
          return createChildSelector(store)
        }, [store])

        const actualChildProps = usePureOnlyMemo(() => {
          return childPropsSelector(store.getState(), wrapperProps)
        }, [store, wrapperProps])

        useIsomorphicLayoutEffect(() => {

        })

        // 渲染的组件
        const renderedWrappedComponent = useMemo(
          () => <WrappedComponent {...actualChildProps} ref={forwardedRef} />,
          [forwardedRef, actualChildProps]
        )
        return renderedWrappedComponent
      // return (
      //   <MainContext.Consumer>
      //     {
      //       value => <WrappedComponent ref={forwardedRef} {...value}  {...props}></WrappedComponent>
      //     }
      //   </MainContext.Consumer>
        
      // )
    }

    return ConnectFunction
  }
}