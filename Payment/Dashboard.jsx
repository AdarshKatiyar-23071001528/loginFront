import React, { useEffect, useState } from "react";
import api from "../src/api/axios.js";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import Box from "../Users/Box.jsx";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {

  const [todayPayment,setTodayPayment] = useState(0);
  const [monthPayment,setMonthPayment] = useState(0);

  const [graph,setGraph] = useState({
    labels:[],
    values:[]
  });

  const [type,setType] = useState("daily");
  const [month,setMonth] = useState(new Date().getMonth()+1);
  const [year,setYear] = useState(new Date().getFullYear());

  useEffect(()=>{
    fetchTodayPayment();
    fetchMonthPayment();
    fetchGraph();
  },[])

  const fetchTodayPayment = async ()=>{
    const res = await api.get("/payment/today-payment");
    setTodayPayment(res?.data?.totalPayment || 0);
  }

  const fetchMonthPayment = async ()=>{
    const res = await api.get("/payment/month-payment");

    if(res?.data?.data?.length > 0){
      setMonthPayment(res.data.data[0].totalPayment);
    }else{
      setMonthPayment(0);
    }
  }

  const fetchGraph = async ()=>{

    const res = await api.get(
      `/payment/payment-graph?type=${type}&month=${month}&year=${year}`
    );

    setGraph({
      labels: res?.data?.labels || [],
      values: res?.data?.values || []
    });

  }

  // const totalFees = 

  const fees = graph.values.reduce((sum, value) => sum + value,0)

  const chartData = {
    labels: graph.labels,
    datasets:[
      {
        label:"Payment",
        data: graph.values,
        backgroundColor:"rgba(37,99,235,0.8)"
      }
    ]
  }

  const options = {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
      legend:{
        display:true
      }
    }
  }

  return (

    <div className="p-4 bg-white h-full w-full flex flex-col gap-6 rounded shadow  ">

      {/* Top Section */}

      <div className="flex justify-between items-center flex-wrap gap-4">

        <h1 className="text-2xl font-bold">Fees</h1>

        {/* Filter */}
        <div className="flex gap-3 flex-wrap">

          <select
            value={type}
            onChange={(e)=>setType(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="daily">Daily</option>
            <option value="yearly">Yearly</option>
          </select>

          {type === "daily" && (
            <select
              value={month}
              onChange={(e)=>setMonth(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="1">Jan</option>
              <option value="2">Feb</option>
              <option value="3">Mar</option>
              <option value="4">Apr</option>
              <option value="5">May</option>
              <option value="6">Jun</option>
              <option value="7">Jul</option>
              <option value="8">Aug</option>
              <option value="9">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dec</option>
            </select>
          )}

          <input
            type="number"
            value={year}
            onChange={(e)=>setYear(e.target.value)}
            className="border px-3 py-2 rounded w-[100px]"
          />

          <button
            onClick={fetchGraph}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Apply
          </button>

        </div>

      </div>


      {/* Cards */}

      <div className="grid md:grid-cols-2 gap-2">

        <div className="bg-white shadow-md p-2 rounded-lg">
          <h2 className="text-gray-600">Today Fees</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2 p-2">
            ₹ {todayPayment}
          </p>
        </div>

        <div className="bg-white shadow-md p-2 rounded-lg">
          <h2 className="text-gray-600">Month Fees</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹ {monthPayment}
          </p>
        </div>

      </div>


      {/* Chart Section */}

      <div className="bg-white shadow-md p-4 rounded-lg">

        <h2 className="text-xl font-semibold mb-4">
          Payment Graph
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Chart */}
          <div className="flex-1 h-[350px]">

            {graph.labels.length > 0 ? (
              <Bar data={chartData} options={options}/>
            ) : (
              <p className="text-gray-500">No Data Found</p>
            )}

          </div>

          {/* Side Box */}
          <div className="w-full lg:w-[200px]">
            <Box name={"Receive"} value={fees}/>
          </div>

        </div>

      </div>

    </div>

  )

}

export default Dashboard;