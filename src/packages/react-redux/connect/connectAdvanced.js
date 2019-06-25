import React, {
  useMemo,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
  useReducer
} from "react"
import hoistStatics from "hoist-non-react-statics"
import MainContext from "../components/Context"
import Subscription from "../utils/Subscription"

const NO_SUBSCRIPTION_ARRAY = [null, null]
const EMPTY_ARRAY = []

function storeStateUpdatesReducer(state, action) {
  const [, updateCount] = state
  return [action.payload, updateCount + 1]
}

const initStateUpdates = () => [null, 0]

// ssr使用useEffect， 浏览器使用useLayoutEffect
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined"
    ? useLayoutEffect
    : useEffect

export default function connectAdvanced(
  selectorFactory,
  {
    context = MainContext,
    getDisplayName = name => `ConnectAdvanced(${name})`,
    methodName = "connectAdvanced",
    // 决定是否监听store变化
    shouldHandleStateChanges = true,
    forwardRef = false,
    ...connectOptions
  } = {}
) {
  const Context = context
  return function wrapConnect(WrappedComponent) {
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    const displayName = getDisplayName(wrappedComponentName)
    const { pure } = connectOptions

    const selectorFactoryOptions = {
      ...connectOptions,
      getDisplayName,
      methodName,
      shouldHandleStateChanges,
      wrappedComponentName,
      WrappedComponent
    }

    // 是否是纯函数组件,不是则不利用缓存，每次重新执行
    const usePureOnlyMemo = pure ? useMemo : callback => callback()
    function ConnectFunction(props) {
      const [propsContext, forwardedRef, wrapperProps] = useMemo(() => {
        const { forwardedRef, ...wrapperProps } = props
        return [props.context, forwardedRef, wrapperProps]
      }, [props])

      // 可以选择性的使用自己定义的context来代替默认生成的MainContext
      const ContextToUse = useMemo(() => {
        return propsContext && propsContext.Consumer ? propsContext : Context
      }, [propsContext])

      // 这个的value值为Provider组件中的value值 -> { store,subscription,}
      const contextValue = useContext(ContextToUse)

      // store必须通过顶层Provicer提供或者通过props的形式传入组件
      const didStoreComeFromProps = Boolean(props.store)
      const didStoreComeFromContext =
        Boolean(contextValue) && Boolean(contextValue.store)
      if (!didStoreComeFromProps && !didStoreComeFromContext) {
        throw new Error(`${displayName}：没有store对象`)
      }
      const store = props.store || contextValue.store


      // props生成方法， 返回selectorFactory.js -> handleSubsequentCall函数，
      // 在每次store发生变化的时候重新生成该props生成器
      const childPropsSelector = useMemo(() => {
        return selectorFactory(store.dispatch, selectorFactoryOptions)
      }, [store])

      const [subscription, notifyNestedSubs] = useMemo(() => {
        if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY // 如果不需要监听变化， subscription和notifyNestedSubs都为空
        // 注册监听器，如果是通过context传入的store,继承context中的subscription监听器
        const subscription = new Subscription(
          store,
          didStoreComeFromProps ? null : contextValue.subscription
        )
        const notifyNestedSubs = subscription.notifyNestedSubs.bind(
          subscription
        )

        return [subscription, notifyNestedSubs]
      }, [store, didStoreComeFromProps, contextValue])

      // 覆盖ContextValue的值，如果来自props返回最近的context的值，
      // 否则将订阅实例加入context中
      const overriddenContextValue = useMemo(() => {
        if (didStoreComeFromProps) {
          return contextValue
        }

        return {
          ...contextValue,
          subscription
        }
      }, [didStoreComeFromProps, contextValue, subscription])


      // 每次dispatch，获取更新后的state的第一个值(action.payload)，保证wrapper component重新渲染
      const [
        [previousStateUpdateResult],
        forceComponentUpdateDispatch
      ] = useReducer(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates)

      if (previousStateUpdateResult && previousStateUpdateResult.error) {
        throw previousStateUpdateResult.error
      }

      // 记录上次props， 上次child props, 
      const lastWrapperProps = useRef(wrapperProps)
      const lastChildProps = useRef()
      const childPropsFromStoreUpdate = useRef()
      const renderIsScheduled = useRef(false)

      // 每次store变化，或者props变化，或者执行dispatch之后重新计算wrapper component的props
      const actualChildProps = usePureOnlyMemo(() => {
        if (
          childPropsFromStoreUpdate.current &&
          wrapperProps === lastWrapperProps.current
        ) {
          return childPropsFromStoreUpdate.current
        }
        return childPropsSelector(store.getState(), wrapperProps)
      }, [store, previousStateUpdateResult, wrapperProps])

      useIsomorphicLayoutEffect(() => {
        lastWrapperProps.current = wrapperProps
        lastChildProps.current = actualChildProps
        renderIsScheduled.current = false

        if (childPropsFromStoreUpdate.current) {
          childPropsFromStoreUpdate.current = null
          notifyNestedSubs()
        }
      })

      useIsomorphicLayoutEffect(() => {
        // 不需要监听store变化，不改变context值
        if (!shouldHandleStateChanges) return

        let didUnsubscribe = false
        let lastThrownError = null

        // 注册监听器,监听store变化
        const checkForUpdates = () => {
          if (didUnsubscribe) {
            return
          }
          const latestStoreState = store.getState()
          let newChildProps, error
          try {
            // 渲染最新的store state
            newChildProps = childPropsSelector(
              latestStoreState,
              lastWrapperProps.current
            )
          } catch (e) {
            error = e
            lastThrownError = e
          }

          if (!error) {
            lastThrownError = null
          }
          // 如果child props的值没有变化
          if (newChildProps === lastChildProps.current) {
            if (!renderIsScheduled.current) {
              notifyNestedSubs()
            }
          } else {
            lastChildProps.current = newChildProps
            childPropsFromStoreUpdate.current = newChildProps
            renderIsScheduled.current = true
            // store state变化，dispatch重新渲染
            forceComponentUpdateDispatch({
              type: "STORE_UPDATED",
              payload: {
                latestStoreState,
                error
              }
            })
          }
        }

        // 触发更新contextValue
        subscription.onStateChange = checkForUpdates
        subscription.trySubscribe()
        // 拉取最新的store state，同步第一次渲染之后store发生的改变
        checkForUpdates()

        const unsubscribeWrapper = () => {
          didUnsubscribe = true
          subscription.tryUnsubscribe()

          if (lastThrownError) {
            throw lastThrownError
          }
        }

        return unsubscribeWrapper
      }, [store, subscription, childPropsSelector])

      // 渲染的组件
      const renderedWrappedComponent = useMemo(
        () => <WrappedComponent {...actualChildProps} ref={forwardedRef} />,
        [forwardedRef, actualChildProps]
      )

      const renderedChild = useMemo(() => {
        if (shouldHandleStateChanges) {
          // 监听store变化，每次刷新context的值
          return (
            <ContextToUse.Provider value={overriddenContextValue}>
              {renderedWrappedComponent}
            </ContextToUse.Provider>
          )
        }

        return renderedWrappedComponent
      }, [renderedWrappedComponent, overriddenContextValue])
      return renderedChild
    }
    const Connect = pure ? React.memo(ConnectFunction) : ConnectFunction
    if (forwardRef) {
      const forwarded = React.forwardRef(function forwardConnectRef(
        props,
        ref
      ) {
        return <Connect {...props} forwardedRef={ref} />
      })

      forwarded.displayName = displayName
      forwarded.WrappedComponent = WrappedComponent
      return hoistStatics(forwarded, WrappedComponent)
    }
    Connect.WrappedComponent = WrappedComponent
    Connect.displayName = displayName
    return hoistStatics(Connect, WrappedComponent)
  }
}
