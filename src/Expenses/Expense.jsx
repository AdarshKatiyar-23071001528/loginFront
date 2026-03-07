import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Expense = () => {

  const [todayExpense,setTodayExpense] = useState(0);
  const [monthExpense,setMonthExpense] = useState(0);
  const [graph,setGraph] = useState({labels:[],values:[]});
  const [dateWise,setDateWise] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    fetchData()
  },[])

  const fetchData = async ()=>{
    try{
      await fetchTodayExpense()
      await fetchMonthExpense()
      await fetchGraph()
      await fetchDateWise()
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  const fetchTodayExpense = async ()=>{
    try{
      const res = await axios.get("/api/today-expense")
      setTodayExpense(res?.data?.totalExpense || 0)
    }catch(err){
      console.log(err)
    }
  }

  const fetchMonthExpense = async ()=>{
    try{
      const res = await axios.get("/api/month-expense")

      if(res?.data?.data?.length > 0){
        setMonthExpense(res.data.data[0].totalExpense)
      }else{
        setMonthExpense(0)
      }

    }catch(err){
      console.log(err)
    }
  }

  const fetchGraph = async ()=>{
    try{
      const res = await axios.get("/api/expense-graph")

      setGraph({
        labels: res?.data?.labels || [],
        values: res?.data?.values || []
      })

    }catch(err){
      console.log(err)
    }
  }

  const fetchDateWise = async ()=>{
    try{
      const res = await axios.get("/api/date-wise-expense")
      setDateWise(res?.data?.data || [])
    }catch(err){
      console.log(err)
    }
  }

  const chartData = {
    labels: graph.labels,
    datasets:[
      {
        label:"Expense",
        data: graph.values
      }
    ]
  }

  if(loading){
    return <p className="p-6 text-lg">Loading...</p>
  }

  return (
    <div className="p-6">

      {/* cards */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-white shadow p-5 rounded">
          <h2 className="text-lg font-semibold">Today Expense</h2>
          <p className="text-2xl font-bold">₹ {todayExpense}</p>
        </div>

        <div className="bg-white shadow p-5 rounded">
          <h2 className="text-lg font-semibold">Month Expense</h2>
          <p className="text-2xl font-bold">₹ {monthExpense}</p>
        </div>

      </div>

      {/* graph */}

      <div className="bg-white shadow p-5 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">Expense Graph</h2>

        {graph.labels.length > 0 ? (
          <Line data={chartData}/>
        ) : (
          <p>No Graph Data</p>
        )}

      </div>

      {/* date wise expense */}

      <div className="bg-white shadow p-5 rounded">
        <h2 className="text-xl font-semibold mb-4">Date Wise Expense</h2>

        {dateWise.length === 0 && (
          <p>No Expense Found</p>
        )}

        {dateWise.map((item)=>(
          <div key={item._id} className="mb-4">

            <h3 className="font-bold mb-2">
              {item._id} (Total ₹{item.totalExpense})
            </h3>

            {item?.expenses?.map((exp)=>(
              <div key={exp._id} className="flex justify-between border-b py-1">

                <p>{exp.name}</p>
                <p>₹ {exp.amount}</p>

              </div>
            ))}

          </div>
        ))}

      </div>

    </div>
  )
}

export default Expense