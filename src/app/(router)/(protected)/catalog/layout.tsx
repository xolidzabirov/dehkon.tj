'use client'
import SidebarCatalog from '@/widgets/sidebarCatalog'
import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex'>
      <div className="">
        <SidebarCatalog />
      </div>
      <div className=""> 
       {children}
      </div>
    </div>
  )
}

export default Layout
