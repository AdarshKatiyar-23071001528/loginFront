import React, { useContext, useState } from 'react'
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import Login from '../../Users/Login';
const StudentLogin = () => {

  const navigate = useNavigate();
  const{studentLogin} = useContext(AppContext);
  const [FormData, setFormData] = useState({
    email:"",
    password:""
  });
  const onChangeHandler = (e) => {
    const {name , value} = e.target;
    setFormData({...FormData, [name] : value});
  }
  const {email, password} = FormData;
  const submithandler = async(e) => {
    e.preventDefault();
    const result = await studentLogin(email, password);
    if(result.success){
      navigate('/');
    }
  }



  return (
    <>
      <div className='studentLoginContainer h-full w-full bg-gray-300 flex  justify-center items-center '>
        <div className='h-[300px] w-[300px]
        md:h-[400px] md:w-[400px] bg-gray-400 rounded-lg shadow-lg flex flex-col justify-center items-center gap-4'>
          <form action="" onSubmit={ submithandler} className='h-[300px] w-[300px]
        md:h-[400px] md:w-[400px] bg-gray-400 rounded-lg shadow-lg flex flex-col justify-center items-center gap-4'>
            <h1>Student Login</h1>
            <div className='flex border-bottom border-black gap-2 w-[70%]'> <FaUser className='mt-2' />
              <input type="email" name="email" id="email" value={FormData.email} onChange={onChangeHandler} placeholder='Enter Email' className='outline-none p-1 w-[70%] bg-trancparent' /></div>


            <div className='flex gap-2 w-[70%] border-bottom border-black'>
              <FaLock className='mt-2' />
              <input type="password" name="password" value={FormData.password} onChange={onChangeHandler} placeholder='Enter Password' className='outline-none bg-transparent p-1  w-[70%]' />
            </div>


            <button type="submit" className='bg-green-400 px-4 py-2 rounded font-bold '>Submit</button>
          </form>

        </div>
      </div>
    </>

  )
}

export default StudentLogin