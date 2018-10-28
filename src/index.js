import React from 'react'
import ReactDOM from 'react-dom'
import 'mini.css'

ReactDOM.render(
  <h1>Daily React with Webpack App!!</h1>,
  document.getElementById('root')
)

module.hot.accept()
