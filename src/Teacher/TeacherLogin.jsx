import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import { FaUser, FaLock } from "react-icons/fa";

const TeacherLogin = () => {
    const navigate = useNavigate();
    const {teacherLogin} = useContext(AppContext);
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
        const result = await teacherLogin(email,password);
        if(result.success) {
            navigate(`/teacher/dash/${result.teacher._id}`);
        }
    }







  return (
       <div className='TeacherLoginContainer h-full w-full  flex  justify-center items-center '>
                        <div className='h-[300px] w-[300px]
                        md:h-[400px] md:w-[400px]  flex flex-col justify-center items-center gap-4'>
                          <form action="" onSubmit={ submitHandler} className='h-[300px] w-[300px]
                        md:h-[400px] md:w-[400px]  flex flex-col justify-center items-center gap-4'>
                            <h1 className="text-2xl font-bold">Teacher</h1>
                            <div className='flex border-bottom border-black gap-2 w-[70%]'> <FaUser className='mt-2' />
                              <input type="email" name="email" id="email" value={formData.email} onChange={onChangeHandler} placeholder='Enter Email' className='outline-none p-1 w-[70%] bg-trancparent' /></div>
                
                
                            <div className='flex gap-2 w-[70%] border-bottom border-black'>
                              <FaLock className='mt-2' />
                              <input type="password" name="password" value={formData.password} onChange={onChangeHandler} placeholder='Enter Password' className='outline-none bg-transparent p-1  w-[70%]' />
                            </div>
                
                
                            <button type="submit" className='bg-green-400 px-4 py-2 rounded font-bold '>Submit</button>
                          </form>
                
                        </div>
                      </div>
  )
}

export default TeacherLogin