"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const Products = () => {
  const params = useParams()
  console.log("Params: ", params);
  
   const id = params.id
  console.log("Userld в Products:", id);

    const Products = [

    ]
  return (
    <div>
        <h1>Produts for User: {id}</h1>
        <div className="">
          {

          }
        </div>
    </div>
  )
}

export default Products
