import React from 'react'
import { useState } from 'react'
import AppContext from '../src/Context/AppContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    const {login} = useContext(AppContext);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const onChangeHandler = (e) =>{
        const {name,value} = e.target;
        setFormData({...formData,[name]:value});
    }
    const {email,password} = formData;
    const submitHandler = async(e) => {
        e.preventDefault();
        const result = await login(email,password);
        if(result.success) {
            navigate('/admin/dash');
        }

    }

    return (
        <>
           

             <div className='AdminLoginContainer h-full w-full  flex  justify-center items-center '>
                    <div className='h-[200px] w-[300px]
                    md:h-[200px] md:w-[300px]  flex flex-col justify-center items-center gap-2'>
                      <form action="" onSubmit={ submitHandler} className='h-[200px] w-[300px]
                    md:h-[200px] md:w-[300px]  flex flex-col justify-around items-center gap-2 '>

                        <p className="text-3xl font-bold">Admin</p>

                        <div className='flex border-bottom border-black gap-2 w-[70%]'> <FaUser className='mt-2' />
                          <input type="email" name="email" id="email" value={formData.email} onChange={onChangeHandler} placeholder='Enter Email' className='outline-none p-1 w-[70%] bg-transparent' />
                          </div>
            
            
                        <div className='flex gap-2 w-[70%] border-bottom border-black'>
                          <FaLock className='mt-2' />
                          <input type="password" name="password" value={formData.password} onChange={onChangeHandler} placeholder='Enter Password' className='outline-none bg-transparent p-1  w-[70%]' />
                        </div>
            
            
                        <button type="submit" className='bg-green-400 px-4 py-2 rounded font-bold mt-2'>Submit</button>

                      </form>
            
                    </div>
                  </div>
        </>
    )
}

export default Login
