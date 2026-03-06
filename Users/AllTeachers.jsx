import React from 'react'

const AllTeachers = ({totalTeacher}) => {
  return (
    
          <div className='w-[200px] border-l-4 border-green-500 rounded-l-2xl flex flex-col bg-green-100 p-2 shadow-lg'>
      <p className='font-bold text-2xl'>Teachers</p>
      <p className='text-gray-600 text-2xl text-center'>{totalTeacher}</p>
    </div>
    
  )
}

export default AllTeachers
