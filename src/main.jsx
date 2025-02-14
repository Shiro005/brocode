import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Social from './Pages/Social/Social.jsx'
import AddPost from './Pages/AddPost/AddPost.jsx'
import Code from './Pages/Code/Code.jsx'
import Community from './Pages/Community/Community.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='' element={<Social />} />
      <Route path='/addpost' element={<AddPost />} />
      <Route path='/code' element={<Code />} />
      <Route path='/community' element={<Community />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)