import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import CreateExpense from "./CreateExp.jsx";

const inputClassName =
  "rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400";

const All = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expense/allExpense");
      setExpenses(res.data.result || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const searchValue = search.toLowerCase();
      const searchMatch =
        !searchValue ||
        item.name?.toLowerCase().includes(searchValue) ||
        item.paidTo?.toLowerCase().includes(searchValue) ||
        item.paidBy?.toLowerCase().includes(searchValue);

      const modeMatch = modeFilter === "All" || item.mode === modeFilter;
      const itemDate = new Date(item.paidAt);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (to) {
        to.setHours(23, 59, 59, 999);
      }

      const fromMatch = from ? itemDate >= from : true;
      const toMatch = to ? itemDate <= to : true;

      return searchMatch && modeMatch && fromMatch && toMatch;
    });
  }, [expenses, search, modeFilter, fromDate, toDate]);

  const totalExpense = useMemo(
    () => filteredExpenses.reduce((acc, item) => acc + Number(item.amount || 0), 0),
    [filteredExpenses],
  );

  return (
    <div className="space-y-6 bg-slate-100 p-4 md:p-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Finance Admin
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Expense Register
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Add new expenses, filter spend history, and inspect payout records
              from one unified expense workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Filtered Rows
              </p>
              <p className="mt-1 text-2xl font-black">{filteredExpenses.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Total Expense
              </p>
              <p className="mt-1 text-2xl font-black">Rs. {totalExpense}</p>
            </div>
          </div>
        </div>
      </section>

      <CreateExpense onCreated={fetchExpense} />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Filters
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Expense Search
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {loading ? "Refreshing..." : `${expenses.length} total entries`}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            placeholder="Search expense, paid to, paid by"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClassName}
          />

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className={inputClassName}
          >
            <option value="All">All modes</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={inputClassName}
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={inputClassName}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-xl font-bold text-slate-900">Expense History</h2>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading expenses...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Paid To</th>
                  <th className="px-5 py-4">Paid By</th>
                  <th className="px-5 py-4">Mode</th>
                  <th className="px-5 py-4">Remark</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.length ? (
                  filteredExpenses.map((item) => (
                    <tr
                      key={item._id}
                      className="text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {item.name || "-"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-rose-700">
                        Rs. {item.amount || 0}
                      </td>
                      <td className="px-5 py-4">{item.paidTo || "-"}</td>
                      <td className="px-5 py-4">{item.paidBy || "-"}</td>
                      <td className="px-5 py-4">{item.mode || "-"}</td>
                      <td className="px-5 py-4">{item.remark || "-"}</td>
                      <td className="px-5 py-4">
                        {item.paidAt
                          ? new Date(item.paidAt).toLocaleDateString("en-IN")
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section> 
    </div>
  );
};

export default All;
