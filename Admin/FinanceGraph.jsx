import React, { useEffect, useState } from "react";
import api from "../src/api/axios.js";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Box from "../Users/Box.jsx";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FinanceGraph = () => {
  const [graph, setGraph] = useState({
    labels: [],
    fees: [],
    expenses: [],
    profit: [],
  });
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [type, setType] = useState("month");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchGraph();
  }, [type, month, year]);

  // cards
  const totalFees = graph.fees.reduce((sum, val) => sum + val, 0);
  const totalExpense = graph.expenses.reduce((sum, val) => sum + val, 0);
  const totalProfit = totalFees - totalExpense;

  console.log(totalFees);

  const fetchGraph = async () => {
    try {
      const res = await api.get(
        `/student/finance-graph?type=${type}&month=${month}&year=${year}`,
      );

      setGraph(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const chartData = {
    labels: type === "year" ? monthNames : graph.labels,
    datasets: [
      {
        label: "Fees Collection",
        data: graph.fees,
        backgroundColor: "rgba(34,197,94,0.6)",
      },
      {
        label: "Expense",
        data: graph.expenses,
        backgroundColor: "rgba(239,68,68,0.6)",
      },
      {
        label: "Profit",
        data: graph.profit,
        backgroundColor: "rgba(59,130,246,0.6)",
      },
    ],
  };

  return (
    <div className="shadow p-4 rounded relative flex justify-around h-full flex-col w-full  ">
      <div >
       <h2 className="text-xl font-semibold mb-4 p-3">
        Finance Overview
      </h2>
      <div className="flex gap-4 mb-4 absolute right-6 top-10">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="month">Month Wise</option>
            <option value="year">Year Wise</option>
          </select>

          {type === "month" && (
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded"
            >
              {monthNames.map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          )}

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded"
          >
            {[2023, 2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div className="flex justify-between w-[80%] h-full   gap-9 ">
        <Bar data={chartData} className="w-[80%] pt-4 " />
        <div className="flex flex-col gap-4 pt-4 ">
          <Box name={"Fees Collection"} value={totalFees} />
          <Box name={"Expense"} value={totalExpense} />
          <Box name={"Profit"} value={totalProfit} />
        </div>
      </div>
      </div>





      
    </div>
  );
};

export default FinanceGraph;
