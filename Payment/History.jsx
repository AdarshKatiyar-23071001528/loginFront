import React, { useEffect, useState } from "react";
import api from "../src/api/axios.js";

const History = () => {
  const [payments, setPayments] = useState([]);

  const [search, setSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch Data
  const fetchPayments = async () => {
    try {
      const res = await api.get("/payment/received");

      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);
  const [data, setNewData] = useState([])

  // 🔎 Filter Logic
  const filteredPayment = payments.filter((item) => {
    const payment = item.payment;

    const nameMatch =
      !search ||
      payment?.studentName?.toLowerCase().includes(search.toLowerCase());

    const idMatch =
      !transactionFilter ||
      payment?.transactionId
        ?.toLowerCase()
        .includes(transactionFilter.toLowerCase());

    const itemDate = new Date(payment?.paidAt);

    let from = fromDate ? new Date(fromDate) : null;
    let to = toDate ? new Date(toDate) : null;

    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    const fromMatch = from ? itemDate >= from : true;
    const toMatch = to ? itemDate <= to : true;

    return nameMatch && idMatch && fromMatch && toMatch;
  });



  // 💰 Total Collection
  const totalAmount = filteredPayment.reduce(
    (acc, item) => acc + (item.payment?.amount || 0),
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">
          Received Payments
        </h1>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Transaction Id"
            value={transactionFilter}
            onChange={(e) => setTransactionFilter(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-3 rounded"
          />
        </div>

        {/* Total Collection */}
        <div className="bg-white shadow rounded p-4 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Total Collection</h2>

          <span className="text-2xl font-bold text-green-600">
            ₹ {totalAmount}
          </span>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Student Name</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Payment Method</th>
                <th className="p-3 text-left">Transaction Id</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {
                filteredPayment.map((item,index) => (
                

                 
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="p-3">{item.payment?.studentName}</td>

                      <td className="p-3 text-green-600 font-semibold">
                        ₹ {item.payment?.amount}
                      </td>

                      <td className="p-3">{item.payment?.paymentMethod}</td>

                      <td className="p-3">{item.payment?.transactionId}</td>

                      <td className="p-3">
                        {new Date(item.payment?.paidAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  )
                
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;