import React, { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../api/axios.js";
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

const getMonthLabel = (value) =>
  new Date(2000, Number(value) - 1, 1).toLocaleString("en-US", { month: "short" });

const Expense = () => {
  const [todayExpense, setTodayExpense] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [graph, setGraph] = useState({ labels: [], values: [] });
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriod());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const latestPeriod = await fetchMonthExpense();
      const period = latestPeriod || getCurrentPeriod();

      setSelectedPeriod(period);

      await Promise.all([fetchTodayExpense(), fetchGraph(period.month, period.year)]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayExpense = async () => {
    const res = await api.get("/expense/today-expense");
    setTodayExpense(res?.data?.totalExpense || 0);
  };

  const fetchMonthExpense = async () => {
    const res = await api.get("/expense/month-expense");
    if (res?.data?.data?.length > 0) {
      setMonthExpense(res.data.data[0].totalExpense);
      return {
        month: String(res.data.data[0]?._id?.month || getCurrentPeriod().month),
        year: String(res.data.data[0]?._id?.year || getCurrentPeriod().year),
      };
    } else {
      setMonthExpense(0);
      return null;
    }
  };

  const fetchGraph = async (month, year) => {
    const res = await api.get(
      `/expense/expense-graph?type=daily&month=${month}&year=${year}`,
    );

    setGraph({
      labels: res?.data?.labels || [],
      values: res?.data?.values || [],
    });
  };

  const totalVisibleExpense = useMemo(
    () => graph.values.reduce((sum, value) => sum + value, 0),
    [graph.values],
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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

  const chartData = {
    labels: graph.labels,
    datasets: [
      {
        label: "Daily Expense",
        data: graph.values,
        backgroundColor: "rgba(244, 63, 94, 0.75)",
        borderRadius: 12,
      },
    ],
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
              Expense Overview
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Monitor daily spending, monthly outflow, and category trendlines
              in the same cleaner admin layout.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Today Expense
              </p>
              <p className="mt-1 text-2xl font-black">Rs. {todayExpense}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                This Month
              </p>
              <p className="mt-1 text-2xl font-black">Rs. {monthExpense}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Chart Total
              </p>
              <p className="mt-1 text-2xl font-black">Rs. {totalVisibleExpense}</p>
            </div>
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
              Monthly Expense Graph
            </h2>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0 overflow-hidden rounded-3xl bg-slate-50 p-3 sm:p-4">
            {loading ? (
              <div className="flex h-[280px] items-center justify-center text-sm font-semibold text-slate-500 sm:h-[360px]">
                Loading expenses...
              </div>
            ) : graph.labels.length > 0 ? (
              <div className="relative h-[280px] w-full sm:h-[360px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm font-semibold text-slate-500 sm:h-[360px]">
                No expense graph data found.
              </div>
            )}
          </div>

          <div className="grid gap-4 content-start">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Report Scope
              </p>
              <p className="mt-3 text-lg font-black text-slate-900">
                {getMonthLabel(selectedPeriod.month)} {selectedPeriod.year}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Daily expense totals for the latest month with expense data.
              </p>
            </div>

            <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                Visible Spend
              </p>
              <p className="mt-3 text-3xl font-black text-rose-900">
                Rs. {totalVisibleExpense}
              </p>
              <p className="mt-2 text-sm text-rose-800">
                Sum of all bars currently rendered in the chart.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Expense;
