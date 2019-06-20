# react-redux

>`react-redux`是官方提供的react绑定库，通常结合`redux`一起使用。[官方文档](http://cn.redux.js.org/docs/react-redux/)

`react-redux`是基于**容器组件和展示组件相分离**的开发思想。简单来说展示组件专注于应用的ui界面，不参与业务逻辑，通常被编写为函数式组件，所有的状态获取与变更都来源于props，比如说弹窗，侧边栏，列表组件。而容器组件专注于应用中数据是如何变化的，同时为展示组件提供数据和行为，拥有自己的状态，通常以class组件的形式存在， 比如说用户信息页，关注用户列表等包含业务的组件。在`react-redux`中可以通过`connect`函数生成。

<div align="center">
  <img src="https://wj-block.oss-cn-shenzhen.aliyuncs.com/WX20190611-110836.png" />
</div>

### 用法

#### 展示组件
```js
/**
 * components/countWrap.js
 */
import React from 'react';

export default function CountWrap(props) {
  return (
    <div>
      <p>{props.count}</p>
      <button onClick={this.props.onADD}>增加</button>
      <button onClick={this.props.onSubtract}>减少</button>
    </div>
  )
}
```

#### 容器组件
```js
/**
 * containers/CountContainer.js
 */
import React, { Component } from 'react'
import CountWrap from '../components/CountWrap';
import { add, subtract } from '../actions/count';
import connect from '../react-redux/connect/connect'

class CountContainer extends Component {
  render() {
    return (
      <div>
        <CountWrap 
          count={this.props.count}
          onAdd={() => this.props.dispatch(add())}
          onSubtract={() => this.props.dispatch(subtract())}
        >

        </CountWrap>
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return state
}

export default connect(mapStateToProps)(CountContainer)
```

#### 将容器放到一个组件
```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CountContainer from './containers/CountContainer';




class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <CountContainer />
        </header>
      </div>
    );
  }
}

export default App;
```

#### 传入store
虽然说可以通过props的形式将store传入所有的容器组件，然后手动监听，但是比较麻烦，常规的做法是使用react-redux提供的`<Provider>`组件，只需在顶层传入store，即可让所有的容器组件都可以访问store

沿用[之前redux中编写的store](https://github.com/wandiao/plugin-practice/blob/master/src/redux/README.md)

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Provider from './react-redux/components/Provider';
import createStore from './redux/createStore';
import counter from './reducers/counter';

const store = createStore(counter, {
  count: 0
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```



