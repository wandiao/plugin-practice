import React, { Component } from 'react'
import { Link, NavLink } from '@/react-router-dom'

import './index.scss'

export default class index extends Component {
  render() {
    return (
      <div className='container router-demo'>
        <h1>react-router-demo</h1>
        <section>
          <h3>normal link</h3>
          <Link to='/router-demo/page1'>page1</Link>
          <Link to={{ pathname: '/router-demo/page2/1' }}>page2</Link>
          <Link to={location => ({ ...location, pathname: '/router-demo/page3' })}>page3</Link>
          <Link to='/router-demo/page4'>Redirect</Link>
          <Link to='/router-demo/page5'>withRouter</Link>
          <Link to='/router-demo/page6'>Prompt</Link>
          <Link to='/router-demo/page7'>ssr</Link>
          <NavLink to='/router-demo/page8'>navLink</NavLink>
        </section>
        {this.props.children}
      </div>
    )
  }
}
