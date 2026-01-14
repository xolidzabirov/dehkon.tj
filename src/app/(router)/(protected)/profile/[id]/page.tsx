'use client'
import { useParams } from 'next/navigation'
import React from 'react'


const ProfileUserById = () => {
    const params = useParams()
    const userId = params.userId 

  return (
    <div>
       <h1 className="text-3xl font-bold">
        Профили пользователя с ID: {userId}
      </h1>
    </div>
  )
}

export default ProfileUserById
