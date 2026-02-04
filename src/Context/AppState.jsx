import React from 'react'
import AppContext from './AppContext'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../api/axios';

const AppState = (props) => {

    // const url = 'http://localhost:1000/api/user'
    const[Users,setUsers] = useState([])
    const [userLogin, setUserLogin] = useState(false)
    const data = 10;
    useEffect(()=>{
        const fetchUser = async() =>{
            const res = await api.get(`/allUser`,{
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
            const res = await api.post(`/register`,
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
            const res = await api.post(`/login`,
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


  return (
   <AppContext.Provider value={{Users,register,login,userLogin}}>
    {
        props.children
    }
   </AppContext.Provider>
  )
}

export default AppState