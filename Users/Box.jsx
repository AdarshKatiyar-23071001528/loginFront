import React, { useEffect, useState } from 'react'

const Box = ({name, value}) => {

  
    let [color, setColor] = useState('');
    let [textColor, setTextColor] = useState('');
    useEffect(() =>{
        if(name === "Receive Payment"){
            setColor("blue");
        }
        else if(name === "Pending Payment" || name === "Fees"){
            setColor("green");
            setTextColor("green");
        }
        else if(name === "Fees Collection"){
          setColor("green");
          setTextColor("green");
        }
        else if(name === "Expense" || name === "Today Expense"){
          setColor("red");
          setTextColor("red");
        }
        else if(name === "Profit"){
          setColor("blue");
          setTextColor("blue");
        }
        else if(name === "Month Expense" ){
          setColor("blue");
          setTextColor("blue");
        }
    },[name])
    
  return (
    <div className={`w-[120px] md:w-[170px]  border-l-2 md:border-l-4  rounded-l-2xl flex flex-col h-[60px] md:h-[100px] md:gap-4
    bg-${color}-100 border-${color}-500 p-2 shadow-lg`}>
      <p className={`font-bold text-sm md:text-xl text-${textColor}-600`}>{name}</p>
      <p className={`text-${textColor}-600 text-sm md:text-2xl text-center`}>₹{value}</p>
    </div>
  )
}

export default Box