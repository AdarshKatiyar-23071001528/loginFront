import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import CreateExpense from "./CreateExp.jsx";

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
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <div className="mb-2 ">
        <p className="p-2 text-3xl font-bold absolute top-0 text-gray-500">Add Expense</p>
         <CreateExpense/>
      </div>
     
      <div className="max-w-6xl mx-auto">
       
        {/* Filters */}

       

        {/* Total Expense Card */}

        <div className="bg-white shadow-md rounded-lg flex flex-col justify-between items-left mt-4 relative mb-4" >
         
        <div className="grid md:grid-cols-4 gap-4 py-2  shadow px-2 rounded-xl ">
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
