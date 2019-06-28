import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import Page4 from './Page4'
import Page5 from './Page5'
import Page6 from './Page6'
import Page7 from './Page7'
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
    path: '/router-demo/page2/:id',
    component: Page2,
    exact: true,
  },
  {
    path: '/router-demo/page3',
    component: Page3,
    exact: true,
  },
  {
    path: '/router-demo/page4',
    component: Page4,
    exact: true,
  },
  {
    path: '/router-demo/page5',
    component: Page5,
    exact: true,
  },
  {
    path: '/router-demo/page6',
    component: Page6,
    exact: true,
  },
  {
    path: '/router-demo/page7',
    component: Page7,
    exact: true,
  },
]