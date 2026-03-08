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

  const chartData = {
    labels: graph.labels,
    datasets:[
      {
        label:"Payment",
        data: graph.values,
        backgroundColor:"rgba(59,130,246,0.7)"
      }
    ]
  }

  const options = {
    responsive:true,
    plugins:{
      legend:{
        display:true
      }
    }
  }

  return (

    <div className="p-6">

      {/* cards */}

      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-white shadow p-5 rounded">
          <h2 className="text-lg font-semibold">Today Payment</h2>
          <p className="text-2xl font-bold">₹ {todayPayment}</p>
        </div>

        <div className="bg-white shadow p-5 rounded">
          <h2 className="text-lg font-semibold">Month Payment</h2>
          <p className="text-2xl font-bold">₹ {monthPayment}</p>
        </div>

      </div>


      {/* filter */}

      <div className="flex gap-4 mb-6 flex-wrap">

        <select
          value={type}
          onChange={(e)=>setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="daily">Daily</option>
          <option value="yearly">Yearly</option>
        </select>


        {type === "daily" && (

          <select
            value={month}
            onChange={(e)=>setMonth(e.target.value)}
            className="border p-2 rounded"
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
          className="border p-2 rounded"
        />

        <button
          onClick={fetchGraph}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>

      </div>


      {/* bar graph */}

      <div className="bg-white shadow p-5 rounded">

        <h2 className="text-xl font-semibold mb-4">
          Payment Graph
        </h2>

        {graph.labels.length > 0 ? (
          <Bar data={chartData} options={options}/>
        ) : (
          <p>No Data Found</p>
        )}

      </div>

    </div>

  )

}

export default Dashboard