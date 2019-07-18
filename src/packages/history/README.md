# history
> `history`是history的解决方案，提供不同环境的history对象以及相应的api

### 用法
```js
import { createBrowserHistory } from 'history'

const history = createBrowserHistory({
  basename: '', // 页面的基础路径
  forceRefresh: false, // 是否强制刷新
  keyLength: 6, // location.key的长度
});

// location对象
const location = history.location

// 监听路由跳转
const unlisten = history.listen((location, action) => {
  console.log(action, location.pathname, location.state)
});

// 跳转到指定路径
history.push('/home', { some: 'state' })

// 取消监听
unlisten()

// ...
```


API

- [x] createBrowerHistory
- [x] createHashHistory
- [x] createMemoryHistory