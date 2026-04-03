import React, { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../src/api/axios.js";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MONTHS = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const inputClassName =
  "rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400";

const getCurrentPeriod = () => ({
  month: String(new Date().getMonth() + 1),
  year: String(new Date().getFullYear()),
});

const Dashboard = () => {
  const [todayPayment, setTodayPayment] = useState(0);
  const [monthPayment, setMonthPayment] = useState(0);
  const [graph, setGraph] = useState({ labels: [], values: [] });
  const [type, setType] = useState("daily");
  const [month, setMonth] = useState(getCurrentPeriod().month);
  const [year, setYear] = useState(getCurrentPeriod().year);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const latestPeriod = await fetchMonthPayment();
        const initialPeriod = latestPeriod || getCurrentPeriod();

        setMonth(initialPeriod.month);
        setYear(initialPeriod.year);

        await Promise.all([
          fetchTodayPayment(),
          fetchGraph("daily", initialPeriod.month, initialPeriod.year),
        ]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const fetchTodayPayment = async () => {
    const res = await api.get("/payment/today-payment");
    setTodayPayment(res?.data?.totalPayment || 0);
  };

  const fetchMonthPayment = async () => {
    const res = await api.get("/payment/month-payment");
    if (res?.data?.data?.length > 0) {
      setMonthPayment(res.data.data[0].totalPayment);
      return {
        month: String(res.data.data[0]?._id?.month || getCurrentPeriod().month),
        year: String(res.data.data[0]?._id?.year || getCurrentPeriod().year),
      };
    } else {
      setMonthPayment(0);
      return null;
    }
  };

  const fetchGraph = async (
    nextType = type,
    nextMonth = month,
    nextYear = year,
  ) => {
    const res = await api.get(
      `/payment/payment-graph?type=${nextType}&month=${nextMonth}&year=${nextYear}`,
    );

    setGraph({
      labels: res?.data?.labels || [],
      values: res?.data?.values || [],
    });
  };

  const totalGraphAmount = useMemo(
    () => graph.values.reduce((sum, value) => sum + value, 0),
    [graph.values],
  );

  const chartData = {
    labels: graph.labels,
    datasets: [
      {
        label: type === "daily" ? "Daily Payment" : "Yearly Payment",
        data: graph.values,
        backgroundColor: "rgba(14, 165, 233, 0.8)",
        borderRadius: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
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
        ticks: {
          precision: 0,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      await fetchGraph();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-slate-100 p-4 md:p-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Finance Admin
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Payment Dashboard
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Track daily collections, month totals, and fee trends from one
              cleaner payment overview.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Today Collection
              </p>
              <p className="mt-1 text-2xl font-black">Rs. {todayPayment}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                This Month
              </p>
              <p className="mt-1 text-2xl font-black">Rs. {monthPayment}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Visible In Chart
              </p>
              <p className="mt-1 text-2xl font-black">Rs. {totalGraphAmount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Filters
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Payment Trend Controls
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClassName}
            >
              <option value="daily">Daily</option>
              <option value="yearly">Yearly</option>
            </select>

            {type === "daily" ? (
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={inputClassName}
              >
                {MONTHS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                Full Year View
              </div>
            )}

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClassName}
            />

            <button
              type="button"
              onClick={handleApply}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Apply
            </button>
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Analytics
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Payment Graph
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {loading ? "Refreshing..." : `${graph.labels.length} points`}
          </div>
        </div>

        <div className="mt-5 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0 overflow-hidden rounded-3xl bg-slate-50 p-3 sm:p-4">
            {graph.labels.length > 0 ? (
              <div className="relative h-[280px] w-full sm:h-[360px]">
                <Bar data={chartData} options={options} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
                No payment graph data found.
              </div>
            )}
          </div>

          <div className="grid gap-4 content-start">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Selected Range
              </p>
              <p className="mt-3 text-lg font-black text-slate-900">
                {type === "daily"
                  ? `${MONTHS.find((item) => item.value === month)?.label || "Month"} ${year}`
                  : `Year ${year}`}
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Collection Snapshot
              </p>
              <p className="mt-3 text-3xl font-black text-cyan-900">
                Rs. {totalGraphAmount}
              </p>
              <p className="mt-2 text-sm text-cyan-800">
                Sum of the currently visible chart data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
