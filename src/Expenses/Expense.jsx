import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import Box from "../../Users/Box.jsx";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Expense = () => {

  const [todayExpense,setTodayExpense] = useState(0);
  const [monthExpense,setMonthExpense] = useState(0);
  const [graph,setGraph] = useState({labels:[],values:[]});
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    fetchData()
  },[])

  const fetchData = async ()=>{
    try{
      await fetchTodayExpense()
      await fetchMonthExpense()
      await fetchGraph()
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  const fetchTodayExpense = async ()=>{
    try{
      const res = await api.get("/expense/today-expense");
      setTodayExpense(res?.data?.totalExpense || 0);
    }catch(err){
      console.log(err);
    }
  }

  const fetchMonthExpense = async ()=>{
    try{
      const res = await api.get("/expense/month-expense");

      if(res?.data?.data?.length > 0){
        setMonthExpense(res.data.data[0].totalExpense);
      }else{
        setMonthExpense(0);
      }

    }catch(err){
      console.log(err);
    }
  }

  const fetchGraph = async ()=>{
    try{

      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const res = await api.get(`/expense/expense-graph?type=daily&month=${month}&year=${year}`);

      setGraph({
        labels: res?.data?.labels || [],
        values: res?.data?.values || []
      });

    }catch(err){
      console.log(err);
    }
  }

  const chartData = {
    labels: graph.labels,
    datasets:[
      {
        label:"Daily Expense",
        data: graph.values,
        backgroundColor:"rgba(200,00,0,0.6)",
        borderRadius:0,
      }
    ]
  };

  const chartOptions = {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
      legend:{
        position:"top"
      }
    }
  };

  if(loading){
    return <p className="p-4 text-lg">Loading...</p>
  }

  return (
    <div className="shadow p-4 rounded relative flex justify-around h-full flex-col">

      {/* heading */}

      <h1 className="text-2xl font-bold mb-4 p-2">
        Expense Overview
      </h1>


     
     


          <div>
        <div className="flex justify-between w-[80%] h-full   gap-9 ">
        <Bar data={chartData} options={chartOptions} className="w-[80%] pt-4 " />
        <div className="flex flex-col gap-4 pt-4 ">
           <Box title="Month Expense" value={`${monthExpense}`} name={"Month Expense"}/>
          <Box title="Today Expense" value={`${todayExpense}`} name={"Today Expense"}/>
        </div>
      </div>
      </div>
        

      </div>

   
  )
}

export default Expense;