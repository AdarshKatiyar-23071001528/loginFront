import React from 'react'

const TotalStudent = ({totalStudent}) => {


  return (
    <div className='w-[200px] border-l-4 border-yellow-500 rounded-l-2xl flex flex-col bg-yellow-100 p-2 shadow-lg'>
      <p className='font-bold text-2xl'>Students</p>
      <p className='text-gray-600 text-2xl text-center'>{totalStudent}</p>
    </div>
  )
}

export default TotalStudent
