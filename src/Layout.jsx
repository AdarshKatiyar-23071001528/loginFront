import React from 'react'
import AppContext from './Context/AppContext';
import { useContext } from 'react';
import AllUsers from '../Users/AllUsers';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Register from '../Users/Register';
import Nav from '../Nav/Nav';
import Login from '../Users/Login';
import Home from '../Home/Home';
import Course from '../Parts/Course';
import Carrer from '../Parts/Carrer';
import Contact from '../Parts/Contact';
import MultiLogin from '../Users/MultiLogin';
import Adminlog from '../Users/Adminlog';
import Teacherlog from '../Users/Teacherlog';
import Studentlog from '../Users/Studentlog';
import StudentRegister from './Student/StudentRegister';
import StudentLogin from './Student/StudentLogin';
import AdminDash from '../Users/AdminDash';
import TeacherDash from '../Users/TeacherDash';
import StudentDash from './Student/StudentDash';
import TeacherDashboard from './Teacher/TeacherDashboard';


const Layout = () => {
    const location = useLocation();
    
  return (
    <>
    {(location.pathname != '/admin/dash') && <Nav/> }
    
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/users' element= {<AllUsers/>}/>
          <Route path='/register' element= {<Register/>}/>
          {/* <Route path='/login' element= {<Login/>}/> */}
          <Route path='/course' element={<Course/>} />
          <Route path='/carrer' element ={<Carrer/>} />
          <Route path='/contact' element ={<Contact/>} />
           <Route path='/login' element ={<MultiLogin/>} />
           <Route path='/admin/login' element ={<Login/>} />
            <Route path='/faculty/login' element ={<Teacherlog/>} />
             <Route path='/student/login' element ={<StudentLogin/>} />
             <Route path='/student/register' element={<StudentRegister/>} /> 
             <Route path="/admin/dash" element={<AdminDash/>} />
             {/* <Route path="/teacher/dash" element={<TeacherDashboard/>} /> */}
             <Route path="/student/dash" element={<StudentDash/>} />
             {/* <Route path="/student/dash/:id" element={<StudentDash/>} /> */}
             <Route path="/teacher/dash/:id" element={<TeacherDashboard/>} />
             <Route path="*" element={<h1 className='text-center text-2xl mt-20'>404 Not Found</h1>} />
        </Routes>
        </>
  )
}

export default Layout