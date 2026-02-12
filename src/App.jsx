import React from 'react'
import AppContext from './Context/AppContext';
import { useContext } from 'react';
import AllUsers from '../Users/AllUsers';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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


const App = () => {

  // const {data} = useContext(AppContext); 
  return (
    <>
      <Router>
        <Nav/>
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
             <Route path='/student/login' element ={<Studentlog/>} />
        </Routes>
      </Router>
      
    </>
  )
}

export default App;
