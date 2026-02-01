import React from 'react'
import AppContext from './Context/appContext';
import { useContext } from 'react';
import AllUsers from '../Users/AllUsers';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from '../Users/Register';
import Nav from '../Nav/Nav';
import Login from '../Users/Login';
import Home from '../Home/Home';
const App = () => {

  // const {data} = useContext(AppContext); 
  return (
    <>
      <Router>
        <Nav/>
        <Routes>
          <Route path='/home' element={<Home/>} />
          <Route path='/allUser' element= {<AllUsers/>}/>
          <Route path='/register' element= {<Register/>}/>
          <Route path='/' element= {<Login/>}/>
        </Routes>
      </Router>
      
    </>
  )
}

export default App;
