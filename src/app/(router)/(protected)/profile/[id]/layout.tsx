'use client'
import React from 'react'
import SidebarProfile from '@/widgets/sidebarProfile'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex '>
       <div className="">
           <SidebarProfile />
       </div>
       <div className="">
           {children}
       </div>
    </div>
  )
}

export default Layout
