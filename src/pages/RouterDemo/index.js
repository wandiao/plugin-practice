import React, { Component } from 'react'
import { Link } from '@/react-router-dom'

import './index.scss'

export default class index extends Component {
  render() {
    return (
      <div className='container router-demo'>
        <h1>react-router-demo</h1>
        <section>
          <h3>normal link</h3>
          <Link to='/router-demo/page1'>page1</Link>
          <Link to={{ pathname: '/router-demo/page2' }}>page2</Link>
          <Link to={location => ({ ...location, pathname: '/router-demo/page3' })}>page3</Link>
        </section>
        {this.props.children}
      </div>
    )
  }
}
