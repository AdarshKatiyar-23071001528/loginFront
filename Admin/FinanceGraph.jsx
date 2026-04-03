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

const getCurrentPeriod = () => ({
  month: String(new Date().getMonth() + 1),
  year: String(new Date().getFullYear()),
});

const getLatestPeriod = (paymentPeriods = [], expensePeriods = []) => {
  const periods = [...paymentPeriods, ...expensePeriods]
    .map((item) => ({
      month: Number(item?._id?.month),
      year: Number(item?._id?.year),
    }))
    .filter((item) => Number.isInteger(item.month) && Number.isInteger(item.year));

  if (periods.length === 0) {
    return getCurrentPeriod();
  }

  periods.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });

  return {
    month: String(periods[0].month),
    year: String(periods[0].year),
  };
};

const FinanceGraph = ({ totalFees: overallTotalFees = 0 }) => {
  const [graph, setGraph] = useState({
    labels: [],
    fees: [],
    expenses: [],
    profit: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

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
  const [month, setMonth] = useState(getCurrentPeriod().month);
  const [year, setYear] = useState(getCurrentPeriod().year);

  useEffect(() => {
    const initializeGraphFilters = async () => {
      try {
        setLoading(true);
        const [paymentRes, expenseRes] = await Promise.all([
          api.get("/payment/month-payment"),
          api.get("/expense/month-expense"),
        ]);

        const latestPeriod = getLatestPeriod(
          paymentRes?.data?.data || [],
          expenseRes?.data?.data || [],
        );

        setMonth(latestPeriod.month);
        setYear(latestPeriod.year);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeGraphFilters();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const loadGraph = async () => {
      await fetchGraph();
    };

    loadGraph();
  }, [initialized, type, month, year]);

  const safeLabels = Array.isArray(graph.labels) ? graph.labels : [];
  const safeFees = Array.isArray(graph.fees) ? graph.fees : [];
  const safeExpenses = Array.isArray(graph.expenses) ? graph.expenses : [];
  const safeProfit = Array.isArray(graph.profit) ? graph.profit : [];

  const totalCollected = safeFees.reduce((sum, val) => sum + Number(val || 0), 0);
  const totalExpense = safeExpenses.reduce((sum, val) => sum + Number(val || 0), 0);
  const totalProfit = totalCollected - totalExpense;

  const fetchGraph = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/student/finance-graph?type=${type}&month=${month}&year=${year}`,
      );

      setGraph({
        labels: Array.isArray(res?.data?.labels) ? res.data.labels : [],
        fees: Array.isArray(res?.data?.fees) ? res.data.fees : [],
        expenses: Array.isArray(res?.data?.expenses) ? res.data.expenses : [],
        profit: Array.isArray(res?.data?.profit) ? res.data.profit : [],
      });
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Unable to load finance chart");
      setGraph({ labels: [], fees: [], expenses: [], profit: [] });
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: type === "year" ? monthNames : safeLabels,
    datasets: [
      {
        label: "Fees Collection",
        data: safeFees,
        backgroundColor: "rgba(34,197,94,0.6)",
      },
      {
        label: "Expense",
        data: safeExpenses,
        backgroundColor: "rgba(239,68,68,0.6)",
      },
      {
        label: "Profit",
        data: safeProfit,
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
      value: overallTotalFees,
      accent: "border-indigo-500 bg-indigo-50 text-indigo-700",
    },
    {
      name: "Fees Collection",
      value: totalCollected,
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

  const hasChartData =
    safeFees.length > 0 || safeExpenses.length > 0 || safeProfit.length > 0;

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
            Compare fee collection, expenses, and profit using the latest available records.
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
              {monthNames.map((item, index) => (
                <option key={item} value={String(index + 1)}>
                  {item}
                </option>
              ))}
            </select>
          )}

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
          >
            {[2023, 2024, 2025, 2026, 2027].map((item) => (
              <option key={item} value={String(item)}>
                {item}
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
            {loading ? (
              <div className="flex h-[260px] items-center justify-center text-sm font-semibold text-slate-500 sm:h-[380px] lg:h-[420px]">
                Loading finance chart...
              </div>
            ) : error ? (
              <div className="flex h-[260px] items-center justify-center px-4 text-center text-sm font-semibold text-rose-600 sm:h-[380px] lg:h-[420px]">
                {error}
              </div>
            ) : hasChartData ? (
              <div className="relative h-[260px] w-full sm:h-[380px] lg:h-[420px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="flex h-[260px] items-center justify-center text-sm font-semibold text-slate-500 sm:h-[380px] lg:h-[420px]">
                No finance graph data found.
              </div>
            )}
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
              {card.label ? <p className="text-xs text-slate-500">{card.label}</p> : null}
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
