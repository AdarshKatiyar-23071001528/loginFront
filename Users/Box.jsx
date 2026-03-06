import React, { useEffect, useState } from 'react'

const Box = ({name, value}) => {
    let [color, setColor] = useState('');
    useEffect(() =>{
        if(name === "Receive Payment"){
            setColor("blue");
        }
        else if(name === "Pending Payment"){
            setColor("green");
        }
    },[name])
    
  return (
    <div className={`w-[200px] border-l-4  rounded-l-2xl flex flex-col 
    bg-${color}-100 border-${color}-500 p-2 shadow-lg`}>
      <p className='font-bold text-xl'>{name}</p>
      <p className='text-gray-600 text-2xl text-center'>{value}</p>
    </div>
  )
}

export default Box