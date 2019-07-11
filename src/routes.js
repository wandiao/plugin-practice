import reduxRoutes from './pages/ReduxDemo/routes'
import routerRouters from './pages/RouterDemo/routes'
import historyRouters from './pages/HistoryDemo/routes'

export default [
  ...reduxRoutes,
  ...routerRouters,
  ...historyRouters,
]