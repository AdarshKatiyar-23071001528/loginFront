import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import api from './api/axios';

const NetworkStatus = () => {


const [isOnline, setIsOnline] = useState(true);

useEffect(()=>{


    const updateStatus = () => {
        setIsOnline(navigator.onLine);
        console.log("Status :", navigator.onLine );
    }
 
//   window.addEventListener("online", goOnline);
//   window.addEventListener("offline", goOffline);
  updateStatus();

  return () => {
    // window.removeEventListener("online", goOnline); 
    // window.removeEventListener("offline", goOffline);
};
},[])

if(!isOnline){
    return (
        <div  className='fixed inset-0 bg-black text-white flex items-center justify-center z-50 flex-col gap-3'>
            <h1>No Internet</h1>
            <p>Please Check Your Internet Connection</p>
            <button onClick ={() => window.location.reload()}>Retry </button>
        </div>
    )
}

return null;

}

export default NetworkStatus