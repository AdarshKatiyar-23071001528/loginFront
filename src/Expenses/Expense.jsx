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
        backgroundColor:"#4f46e5",
        borderRadius:6
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
    return <p className="p-6 text-lg">Loading...</p>
  }

  return (
    <div className="h-screen bg-gray-100 p-4 flex flex-col">

      {/* heading */}

      <h1 className="text-2xl font-bold mb-4">
        Expense Dashboard
      </h1>

      {/* cards */}

      <div className="grid grid-cols-2 gap-4 mb-4">

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow p-4 rounded-lg">
          <h2 className="text-sm">Today Expense</h2>
          <p className="text-xl font-bold mt-1">
            ₹ {todayExpense}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow p-4 rounded-lg">
          <h2 className="text-sm">Month Expense</h2>
          <p className="text-xl font-bold mt-1">
            ₹ {monthExpense}
          </p>
        </div>

      </div>

      {/* graph */}

      <div className="bg-white shadow rounded-lg p-4 flex-1">

        <h2 className="text-lg font-semibold mb-2">
          Expense Graph
        </h2>

        <div className="h-[300px]">

          {graph.labels.length > 0 ? (
            <Bar data={chartData} options={chartOptions}/>
          ) : (
            <p>No Graph Data</p>
          )}

        </div>

      </div>

    </div>
  )
}

export default Expense;