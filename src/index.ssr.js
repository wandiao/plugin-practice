import Koa from 'koa'
import send from 'koa-send'
import React from "react"
import ReactDOMServer from "react-dom/server"
import { StaticRouter } from "@/react-router"
import { createStore, applyMiddleware } from '@/redux'
import { Provider } from '@/react-redux'

//打包生成的客户端资源，需要先执行npm run build生成build文件夹
import buildPath from '../build/asset-manifest.json'


import reducers from './reducers/index'
import middleware1 from './utils/middleware1'
import middleware2 from './utils/middleware2'
import App from './App'

const app = new Koa()

const store = createStore(reducers, {
  count: 0,
  todos: [],
}, applyMiddleware(middleware1, middleware2))


app.use(async (ctx) => {
  const context = {}
  const req = ctx.request
  const data = {
    foo: '初始数据'
  }
  try {
    // 获取资源路径
    await send(ctx, ctx.path, {
      root: './build'
    })
  } catch(err) {
    // 获取不到资源返回html内容
    if (err.status === 404) {
      const html = ReactDOMServer.renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App initData={data} />
          </StaticRouter>
        </Provider>
      )
      ctx.body = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <title>React App</title>
            <link href='${buildPath.files['main.css']}' rel='stylesheet'>
            <script type="text/javascript">window.__INITIAL_DATA__ = ${JSON.stringify(data)}</script>
          </head>
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">${html}</div>
            <script src="${buildPath.files['main.js']}"></script>
          </body>
        </html>
       `
    } else {
      throw err
    }
  }
})

app.listen(4003, () => {
    console.log('启动成功, 监听4003端口')
})