import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from '../Nav/Nav';
import NetworkStatus from './NetworkStatus';
import About1 from '../Parts/About1';
import RedirectToWebsite from './RedirectToWebsite';

const Home = lazy(() => import('../Home/Home'));
const AllUsers = lazy(() => import('../Users/AllUsers'));
const Register = lazy(() => import('../Users/Register'));
const Course = lazy(() => import('../Parts/Course'));
const Carrer = lazy(() => import('../Parts/Carrer'));
const Contact = lazy(() => import('../Parts/Contact'));
const MultiLogin = lazy(() => import('../Users/MultiLogin'));
const Login = lazy(() => import('../Users/Login'));
const Teacherlog = lazy(() => import('../Users/Teacherlog'));
const StudentRegister = lazy(() => import('./Student/StudentRegister'));
const StudentLogin = lazy(() => import('./Student/StudentLogin'));
const AdminDash = lazy(() => import('../Users/AdminDash'));
const StudentDash = lazy(() => import('./Student/StudentDash'));
const TeacherDashboard = lazy(() => import('./Teacher/TeacherDashboard'));
const About = lazy(() => import('../Parts/About')); 


const Layout = () => {
  const location = useLocation();

  const hideNav =
    location.pathname === "/admin/dash" ||
    location.pathname.startsWith("/teacher/dash") ||
    location.pathname.startsWith("/student/dash") ||
    location.pathname === "/login";

  return (
    <>
      {/* <NetworkStatus/> */}
      {!hideNav && <Nav />}
      <Suspense fallback={<div className='min-h-[40vh] flex items-center justify-center text-lg font-medium text-slate-600'>Loading...</div>}>
        <Routes>
          {/* <Route path='/' element={<RedirectToWebsite/>} /> */}
          <Route path='/' element={<Home/>}/>
          <Route path='/users' element={<AllUsers/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/course' element={<Course/>} />
          <Route path='/carrer' element={<Carrer/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/login' element={<MultiLogin/>} />
          <Route path='/admin/login' element={<Login/>} />
          <Route path='/faculty/login' element={<Teacherlog/>} />
          <Route path='/student/login' element={<StudentLogin/>} />
          <Route path='/student/register' element={<StudentRegister/>} /> 
          <Route path="/admin/dash" element={<AdminDash/>} />
          <Route path="/student/dash" element={<StudentDash/>} />
          <Route path="/teacher/dash/:id" element={<TeacherDashboard/>} />
          <Route path="/about" element={<About/>} />
          <Route path="*" element={<h1 className='text-center text-2xl mt-20'>404 Not Found</h1>} />
        </Routes>
      </Suspense>
    </>
  );
};
export default Layout
