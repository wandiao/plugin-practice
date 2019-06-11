import React from 'react';

export default function CountWrap(props) {
  return (
    <div>
      <p>{props.count}</p>
      <button onClick={props.onAdd}>增加</button>
      <button onClick={props.onSubtract}>减少</button>
    </div>
  )
}
