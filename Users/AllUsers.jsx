import React from 'react'
import AppContext from '../src/Context/AppContext'
import { useContext } from 'react'

const AllUsers = () => {
   const{Users} = useContext(AppContext);
  return (
    <>
    <table border="1" width="100%" >
      <caption>Teacher's Table</caption>
      <thead>
        <tr>
          <th>Sr.no</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {Users?.map((user,i) => 
        <tr key={user._id}>
          <td>{i+1}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          
        </tr>
        )}
        
      </tbody>

    </table>
    </>
  )
}

export default AllUsers