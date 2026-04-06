import React from 'react'
import AppContext from './AppContext'
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../api/axios';
import { setAuthToken, clearAuthToken, setAuthUser } from "../utils/auth";

const AppState = (props) => {

    // const url = 'http://localhost:1000/api/user'

    const [userLogin, setUserLogin] = useState(false)
 

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
            if (res.data.success && res.data.token) {
                setAuthToken(res.data.token);
                setAuthUser(res.data.user);
            } else {
                clearAuthToken();
            }
            setUserLogin(res.data.success);
          return res.data;
        }

    const verifyAdminOtp = async(challengeToken, otp) =>{
        const res = await api.post(`user/verify-login-otp`,
            {challengeToken, otp},{
            headers:{
                "Content-Type":"Application/json"
            },
            withCredentials: true
        })
        if (res.data.success && res.data.token) {
            setAuthToken(res.data.token);
            setAuthUser(res.data.user);
        } else {
            clearAuthToken();
        }
        return res.data;
    }

    const resendAdminOtp = async(challengeToken) =>{
        const res = await api.post(`user/resend-login-otp`,
            {challengeToken},{
            headers:{
                "Content-Type":"Application/json"
            },
            withCredentials: true
        })
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
        try {
            const res = await api.post('/student/login', {email,password},{
                headers:{
                    'Content-Type' : "Application/json"
            },
            withCredentials: true
        })
        if (res.data.success && res.data.token) {
            setAuthToken(res.data.token);
            setAuthUser(res.data.student);
        } else {
            clearAuthToken();
        }
        alert(res.data.message);
        return res.data;
        } catch (error) {
            clearAuthToken();
            const payload = {
                success: false,
                message: error.response?.data?.message || "Student login failed",
            };
            alert(payload.message);
            return payload;
        }
    }

    const teacherLogin = async(email,password) => {
      try {
        const res = await api.post('/teacher/login', {email,password},{
          headers:{ 'Content-Type': "Application/json" },
          withCredentials: true
        });
        if (res.data.success && res.data.token) {
          setAuthToken(res.data.token);
          setAuthUser(res.data.teacher);
        } else {
          clearAuthToken();
        }
        alert(res.data.message);
        return res.data;
      } catch (error) {
        clearAuthToken();
        const payload = {
          success: false,
          message: error.response?.data?.message || "Teacher login failed",
        };
        alert(payload.message);
        return payload;
      }
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
   <AppContext.Provider value={{register,login,verifyAdminOtp,resendAdminOtp,userLogin,studentRegister,studentLogin,teacherLogin,createSubject,assignTeacher,getSubjects,getTeachers,subjectsByTeacher,studentsForSubject,markAttendance,teacherprofile,}}>
    {
        props.children
    }
   </AppContext.Provider>
  )
}

export default AppState
