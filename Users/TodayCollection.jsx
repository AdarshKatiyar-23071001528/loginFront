import React, { useEffect, useState } from 'react'
import api from '../src/api/axios'

const TodayCollection = () => {

  let [collection, setCollection] = useState(0);
  useEffect(()=>{
    todayPayment();
  },[])


  const todayPayment = async()=>{
    try {
      let payment = await api.get("/payment/today-approve");
      if(payment.data.success){
          setCollection(payment.data.totalAmount);
          console.log(payment.totalAmount);
      }
    } catch (error) {
      
    }
  } 


//   const todayPayment = async()=>{
//   try {
//     let payment = await api.get("/payment/today-approve");
//     console.log("API RESPONSE:", payment);

//     if(payment.data.success){
//       setCollection(payment.data.totalAmount);
//     }

//   } catch (error) {
//     console.log("ERROR:", error);
//   }
// }

  return (


    <div className='w-[200px] border-l-4 border-blue-500 rounded-l-2xl flex flex-col bg-blue-100 p-2 shadow-lg'>
      <p className='font-bold text-xl'>Today Collection</p>
      <p className='text-gray-600 text-2xl text-center'>₹{collection}</p>
    </div>
  )
}

export default TodayCollection
