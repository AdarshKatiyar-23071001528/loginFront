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

  // const chartData = {
  //   labels: graph.labels,
  //   datasets:[
  //     {
  //       label:"Daily Expense",
  //       data: graph.values,
  //       backgroundColor:"rgba(200,00,0,0.6)",
  //       borderRadius:6,
  //     }
  //   ]
  // };

  // const chartOptions = {
  //   responsive:true,
  //   maintainAspectRatio:false,
  //   plugins:{
  //     legend:{
  //       position:"top"
  //     }
  //   }
  // };


  const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    x: {
      // categoryPercentage: 0.1, // Makes bars thinner
      // barPercentage: 0.8, // Makes bars thinner
    },
    y: {
      // Configure y-axis if necessary
    },
  },
};

const chartData = {
  labels: graph.labels,
  datasets: [
    {
      label: "Daily Expense",
      data: graph.values,
      backgroundColor: "rgba(200,0,0,0.6)",
      borderRadius: 0,

      barThickness:50,
    },
  ],
};

  if(loading){
    return <p className="p-4 text-lg">Loading...</p>
  }

  return (
   <div className="">

  {/* heading */}
  <h1 className="text-2xl font-bold mb-4 p-2">
    Expense Overview
  </h1>

  <div className="h-full flex flex-col md:flex-row gap-9">

    {/* Chart section */}
    <div className="md:w-4/3 w-full mb-4 md:mb-0">
      <Bar data={chartData} options={chartOptions} />
    </div>

    {/* Box section */}
    <div className="flex md:flex-col md:w-1/3 w-full space-y-4 md:space-y-0 md:ml-4 gap-4">
      <Box title="Month Expense" value={`${monthExpense}`} name={"Month Expense"} />
      <Box title="Today Expense" value={`${todayExpense}`} name={"Today Expense"} />
    </div>

  </div>
</div>
        


   
  )
}

export default Expense;