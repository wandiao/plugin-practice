import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import Index from './index'

export default [
  {
    path: '/router-demo',
    component: Index,
    exact: true,
  },
  {
    path: '/router-demo/page1',
    component: Page1,
    exact: true,
  },
  {
    path: '/router-demo/page2',
    component: Page2,
    exact: true,
  },
  {
    path: '/router-demo/page3',
    component: Page3,
    exact: true,
  },
]