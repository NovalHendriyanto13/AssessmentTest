import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { reduxHelper } from './helpers/redux.helper.js'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={reduxHelper}>
    <App />
  </Provider>,
)
