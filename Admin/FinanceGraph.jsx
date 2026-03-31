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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FinanceGraph = (totalfees) => {
  console.log("Total Fees from AdminDash:", totalfees.totalFees);
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

  const totalFees = graph.fees.reduce((sum, val) => sum + val, 0);
  const totalExpense = graph.expenses.reduce((sum, val) => sum + val, 0);
  const totalProfit = totalFees - totalExpense;

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 12,
          font: {
            size: 11,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `Rs. ${value}`,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const summaryCards = [
    {
      name: "Total Fees",
      label: "This fees calculate after discount",
      value: totalfees.totalFees,
      accent: "border-indigo-500 bg-indigo-50 text-indigo-700",
    },
    {
      name: "Fees Collection",
      value: totalFees,
      accent: "border-emerald-500 bg-emerald-50 text-emerald-700",
    },
    {
      name: "Expense",
      value: totalExpense,
      accent: "border-rose-500 bg-rose-50 text-rose-700",
    },
    {
      name: "Profit",
      value: totalProfit,
      accent: "border-sky-500 bg-sky-50 text-sky-700",
    },
    
  ];

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Finance Graph
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            Finance Overview
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Compare fee collection, expenses, and profit by month or across the year.
          </p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-auto">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
          >
            <option value="month">Month Wise</option>
            <option value="year">Year Wise</option>
          </select>

          {type === "month" && (
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
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
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
          >
            {[2023, 2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.8fr)]">
        <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Performance Chart</p>
              <p className="text-xs text-slate-500">
                {type === "year" ? "Yearly performance view" : "Selected month performance view"}
              </p>
            </div>
          </div>
          <div className="min-w-0 overflow-hidden rounded-3xl bg-slate-50 p-3 sm:p-4">
            <div className="relative h-[260px] w-full sm:h-[380px] lg:h-[420px]">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {summaryCards.map((card) => (
            <article
              key={card.name}
              className={`rounded-3xl border-l-4 p-4 shadow-sm ${card.accent}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                {card.name}
              </p>
              {card.label && (
                <p className="text-xs text-slate-500">
                  {card.label}
                </p>
              )}
            
              <p className="mt-3 text-2xl font-black sm:text-3xl">
                Rs. {Number(card.value || 0).toLocaleString("en-IN")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinanceGraph;
