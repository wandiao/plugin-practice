import Pages1 from './page1/index'
import Pages2 from './page2/index'

export default [
  {
    path: ['/history-demo', '/history-demo/page1'],
    component: Pages1,
    exact: true,
  },
  {
    path: '/history-demo/page2',
    component: Pages2,
  },
]