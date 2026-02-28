import React from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaHome } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { FaUserGear } from "react-icons/fa6";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";


const AdminDash = () => {
    let [counter, setcounter] = useState(false);
    console.log(useLocation().pathname)

  return (

    <>
        
      <nav>
        <div className='flex justify-between items-center h-[80px] bg-[#1B1B1B] text-white px-4'>
          {counter ? <RxCross2 size={30} onClick={()=>setcounter(!counter)}/> : <IoMdMenu size={30} onClick={()=>setcounter(!counter)}/>}
            
          {/* <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
          <div className='md:hidden' onClick={() => setcounter(!counter)}>
            {counter ? <RxCross2 size={30} /> : <IoMdMenu size={30} />}
          </div>
          <ul className={`md:flex md:items-center md:gap-6 absolute md:static bg-[#1B1B1B] w-full left-0 md:w-auto transition-all duration-300 ease-in ${counter ? 'top-[80px]' : 'top-[-200px]'}`}>
            <li><a href="/admin" className='block py-2 px-4 text-white hover:bg-gray-700 rounded'>Home</a></li>
            <li><a href="/admin/users" className='block py-2 px-4 text-white hover:bg-gray-700 rounded'>Users</a></li>
            < li><a href="/admin/settings" className='block py-2 px-4 text-white hover:bg-gray-700 rounded'>Settings</a></li>
          </ul> */}
        </div>
      </nav>
       
      
        {
          counter && (<div className='h-[100%] w-[300px] bg-[#1B1B1B] text-white absolute top-[80px] left-0 flex flex-col items-start gap-4 p-4'>
          <li className='flex items-center gap-2'><FaHome />Home</li>
          <li className='flex items-center gap-2'><PiStudent />Student</li>
          <li className='flex items-center gap-2'><FaMoneyBillAlt />Fees</li>
          <li className='flex items-center gap-2'><FaUserGear /> Staff</li>
          <li className='flex item-center gap-2'><FcMoneyTransfer /> Expense</li>
          
            
        </div>)
        }
        
    </>


  )
}

export default AdminDash