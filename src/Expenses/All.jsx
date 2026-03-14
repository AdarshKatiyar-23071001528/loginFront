import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

const All = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("All");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchExpense = async () => {
    const res = await api.get("/expense/allExpense");
    setExpenses(res.data.result);
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  // 🔎 Search + Filter + Date Filter
  const filteredExpenses = expenses.filter((item) => {
    const searchMatch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.paidTo?.toLowerCase().includes(search.toLowerCase()) ||
      item.paidBy?.toLowerCase().includes(search.toLowerCase());

    const modeMatch = modeFilter === "All" || item.mode === modeFilter;

    const itemDate = new Date(item.paidAt);

    let from = fromDate ? new Date(fromDate) : null;
    let to = toDate ? new Date(toDate) : null;

    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    const fromMatch = from ? itemDate >= from : true;
    const toMatch = to ? itemDate <= to : true;

    return searchMatch && modeMatch && fromMatch && toMatch;
  });

  // 💰 Total Expense
  const totalExpense = filteredExpenses.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">All Expenses</h1>

        {/* Filters */}

        <div className="grid md:grid-cols-4 gap-4 mb-4 shadow p-2 rounded-xl">
          {/* Search */}

          <input
            type="text"
            placeholder="Search expense..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded focus:ring-2 focus:ring-blue-400"
          />

          {/* Mode Filter */}

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="border p-3 rounded focus:ring-2 focus:ring-blue-400"
          >
            <option value="All">All Mode</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          {/* From Date */}

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-3 rounded focus:ring-2 focus:ring-blue-400"
          />

          {/* To Date */}

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-3 rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Total Expense Card */}

        <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Filtered Total Expense</h2>

          <span className="text-2xl font-bold text-green-600">
            ₹ {totalExpense}
          </span>
        </div>

        {/* Expense Table */}

        <div className="bg-white shadow-lg  overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Paid To</th>
                <th className="p-3 text-left">Paid By</th>
                <th className="p-3 text-left">Mode</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{item.name}</td>

                  <td className="p-3 text-green-600 font-semibold">
                    ₹ {item.amount}
                  </td>

                  <td className="p-3">{item.paidTo}</td>

                  <td className="p-3">{item.paidBy}</td>

                  <td className="p-3">{item.mode}</td>

                  <td className="p-3">
                    {new Date(item.paidAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default All;
