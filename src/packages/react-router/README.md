# react-router
>Rreact-router是完整的 React路由解决方案。[官方文档](http://cn.redux.js.org/docs/react-redux/)

### 用法
```js
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>
  );
}

export default AppRouter;
```


API

- [x] Router
- [x] Route
- [x] MemoryRouter
- [x] StaticRouter
- [x] Switch
- [x] Redirect
- [x] withRouter
- [x] Prompt
- [x] matchPath