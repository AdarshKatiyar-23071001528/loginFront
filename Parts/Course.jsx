import React from 'react'

const Course = () => {
  return (
    <main className='home bg-gray-100 h-screen w-full grid grid-cols-2 justify-center items-center'>
      <div className='courses'>
        <h1 className='text-3xl font-bold mb-4'>Courses</h1>
        <p>Welcome to our courses page!</p>
      </div>
      <div className='coruseDetails'>
       <h1>Course Details</h1>
      </div>
    </main>
  )
}

export default Course
