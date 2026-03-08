import React, { useEffect, useState } from "react";
import api from '../api/axios.js'
// import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement
// } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);


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
      const res = await api.get("/expense/today-expense")
      setTodayExpense(res?.data?.totalExpense || 0)
    }catch(err){
      console.log(err)
    }
  }

  const fetchMonthExpense = async ()=>{
    try{
      const res = await api.get("/expense/month-expense")

      if(res?.data?.data?.length > 0){
        setMonthExpense(res.data.data[0].totalExpense)
      }else{
        setMonthExpense(0)
      }

    }catch(err){
      console.log(err)
    }
  }

  // const fetchGraph = async ()=>{
  //   try{
  //     const res = await api.get(`{/expense/expense-graph?type=daily&month=${month}&year=${year}}`)

  //     setGraph({
  //       labels: res?.data?.labels || [],
  //       values: res?.data?.values || []
  //     })

  //   }catch(err){
  //     console.log(err)
  //   }
  // }
  const fetchGraph = async ()=>{
  try{

    const today = new Date()

    const month = today.getMonth() + 1
    const year = today.getFullYear()

    const res = await api.get(`/expense/expense-graph?type=daily&month=${month}&year=${year}`)

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
      const res = await api.get("/expense/getDateWiseExpense")
      setDateWise(res?.data?.data || [])
    }catch(err){
      console.log(err)
    }
  }

  // const chartData = {
  //   labels: graph.labels,
  //   datasets:[
  //     {
  //       label:"Expense",
  //       data: graph.values
  //     }
  //   ]
  // }
// const chartData = {
//   labels: graph.labels,
//   datasets:[
//     {
//       label:"Expense",
//       data: graph.values,
//       borderColor:"red",
//       backgroundColor:"rgba(255,0,0,0.3)",
//       tension:0.4
//     }
//   ]
// }

const chartData = {
  labels: graph.labels,
  datasets:[
    {
      label:"Expense",
      data: graph.values,
      backgroundColor:"rgba(255,99,132,0.6)"
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

      <div className="bg-white shadow p-5 rounded mb-4">
        <h2 className="text-xl font-semibold mb-4">Expense Graph</h2>

        {graph.labels.length > 0 ? (
          <Bar data={chartData}/>
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