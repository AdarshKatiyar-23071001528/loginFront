import React from 'react'
import AppContext from './AppContext'
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../api/axios';
import { useLocation } from 'react-router-dom';

const AppState = (props) => {

    // const url = 'http://localhost:1000/api/user'
    const[Users,setUsers] = useState([])
    const [userLogin, setUserLogin] = useState(false)
    const data = 10;
    useEffect(()=>{
        const fetchUser = async() =>{
            const res = await api.get(`user/allUser`,{
                headers:{
                    "Content-Type":"Application/json"
                },
                withCredentials: true
            })
            console.log(res.data.alluser);
            setUsers(res.data.alluser);
        }
        fetchUser();
    },[])

    //register User
    const register = async(name,email,password) =>{
            const res = await api.post(`user/register`,
                {name,email,password},{
                headers:{
                    "Content-Type":"Application/json"
                },
                withCredentials: true
            })
          alert(res.data.message);
          return res.data;
        }
    const login = async(email,password) =>{
            const res = await api.post(`user/login`,
                {email,password},{
                headers:{
                    "Content-Type":"Application/json"
                },
                withCredentials: true
            })
            setUserLogin(res.data.success);
          alert(res.data.message);
          return res.data;
        }

    const studentRegister = async(rollno, email, password) =>{
        const res = await api.post('/student/register', {rollno, email, password},{
            headers:{
                "Content-Type": "Application/json"
            },
            withCredentials: true
        })
        alert(res.data.message);
        return res.data;
    }
    const studentLogin = async(email,password) => {
        const res = await api.post('/student/login', {email,password},{
            headers:{
                'Content-Type' : "Application/json"
        },
        withCredentials: true
    })
    alert(res.data.message);
    return res.data;
    }

    const teacherLogin = async(email,password) => {
      const res = await api.post('/teacher/login', {email,password},{
        headers:{ 'Content-Type': "Application/json" },
        withCredentials: true
      });
      alert(res.data.message);
      return res.data;
    }

    // subject and attendance APIs
    const createSubject = async (data) => {
      const res = await api.post('/subject', data, {
        headers: { 'Content-Type': 'Application/json' },
        withCredentials: true,
      });
      return res.data;
    };

    const assignTeacher = async ({ subjectId, teacherId }) => {
      const res = await api.put('/subject/assign', { subjectId, teacherId }, {
        headers: { 'Content-Type': 'Application/json' },
        withCredentials: true,
      });
      return res.data;
    };

    const getSubjects = async () => {
      const res = await api.get('/subject/all');
      return res.data;
    };

    const getTeachers = async () => {
      const res = await api.get('/user/allTeacher');
      return res.data;
    };

    const subjectsByTeacher = async (teacherId) => {
      const res = await api.get(`/subject/teacher/${teacherId}`);
      return res.data;
    };

    const studentsForSubject = async (subjectId) => {
      const res = await api.get(`/attendance/students/${subjectId}`);
      return res.data;
    };

    const markAttendance = async (payload) => {
      const res = await api.post('/attendance', payload, {
        headers: { 'Content-Type': 'Application/json' },
        withCredentials: true,
      });
      return res.data;
    };
    
  const teacherprofile = async (teacherId) => {
      const res = await api.get(`/teacher/profile/${teacherId}`);
      return res.data;
    }
  return (
   <AppContext.Provider value={{Users,register,login,userLogin,studentRegister,studentLogin,teacherLogin,createSubject,assignTeacher,getSubjects,getTeachers,subjectsByTeacher,studentsForSubject,markAttendance,teacherprofile}}>
    {
        props.children
    }
   </AppContext.Provider>
  )
}

export default AppState