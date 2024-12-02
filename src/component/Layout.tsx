
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="flex w-full h-[100vh] flex-row justify-between bg-[#161B21] ">
      <div className="w-[20%] min-h-full p-[1%]">
      <Sidebar></Sidebar>
      </div>
      <main className='min-h-full w-[85%] bg-[#161B21] px-[1%] relative flex flex-col pt-4 '>
      <Outlet/>
      </main>
     
    </div>
  )
}

export default Layout

