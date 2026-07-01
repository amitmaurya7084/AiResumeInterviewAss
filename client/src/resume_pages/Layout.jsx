import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../resume_components/Navbar'
import { useSelector } from 'react-redux'
import Loader from '../resume_components/Loader'
import { Login } from './Login'


export const Layout = () => {
  const {user, loading} =useSelector(state=>state.auth)
  if(loading){
    return <Loader/>
  }
  return (
    <div>
      {
        user?(
           <div className='min-h-screen bg-gray-50'>
          <Navbar/>
            <Outlet/>
        </div>
          
        ): <Login/>
      }
         
       
    </div>
  )
}
