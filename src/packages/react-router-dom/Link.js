import React from "react"

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

function LinkAnchor({ innerRef, navigate, onClick, ...rest }) {
  const { target } = rest

  return (
    <a
      {...rest}
      ref={innerRef} // TODO: Use forwardRef instead
      onClick={event => {
        try {
          if (onClick) onClick(event)
        } catch (ex) {
          event.preventDefault()
          throw ex
        }

        if (
          !event.defaultPrevented && // onClick prevented default
          event.button === 0 && // ignore everything but left clicks
          (!target || target === "_self") && // let browser handle "target=_blank" etc.
          !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
          event.preventDefault()
          navigate()
        }
      }}
    />
  )

}