import React from 'react'
import ReactDom from 'react-dom'


import App from './App'

// line below is saying put everything we create in App into a div with id="root"
// this div can be found in public > index.html
ReactDom.render(<App />, document.querySelector('#root'))