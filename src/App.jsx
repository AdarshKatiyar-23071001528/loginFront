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
          <Route path='/login' element= {<Login/>}/>
          <Route path='/course' element={<Course/>} />
          <Route path='/carrer' element ={<Carrer/>} />
          <Route path='/contact' element ={<Contact/>} />
           
        </Routes>
      </Router>
      
    </>
  )
}

export default App;
