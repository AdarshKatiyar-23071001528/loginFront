import React from 'react'
import AppContext from '../src/Context/appContext'
import { useContext } from 'react'

const AllUsers = () => {
   const{Users} = useContext(AppContext);
  return (
    <>
    {Users?.map((user) => 
    <div key={user._id}>
        
        <h1>Name: {user.name}</h1>
        <p>Email: {user.email}</p>
        
    </div>)}
    </>
  )
}

export default AllUsers