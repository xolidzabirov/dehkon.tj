import Footer from '@/widgets/footer'
import Header from '@/widgets/header'
import React from 'react'

const Layout = ({children}: { children: React.ReactNode}) => {
  return (
    <div>
      <Header/>
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
