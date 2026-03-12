import React, { useEffect, useState } from "react";
import api from "../src/api/axios.js";

const History = () => {
  const [payments, setPayments] = useState([]);

  const [search, setSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

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

  // 🔎 Filter Logic

 const filteredPayments = payments.filter((item) => {
  return (item.payment.studentName.toLowerCase().includes((nameFilter).toLowerCase()) 

 );
}




);

  // 💰 Total Collection

  const totalAmount = filteredPayments.reduce(
    (acc, item) => acc + (item.payment?.amount || 0),
    0,
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">
          Received Payments
        </h1>

        {/* Filters */}

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
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
          <h2 className="text-xl font-semibold">Filtered Total Collection</h2>

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
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-5">
                    No Data Found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((item) => {
                  const payment = item.payment;

                  return (
                    <tr key={item._id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{payment?.studentName}</td>

                      <td className="p-3 text-green-600 font-semibold">
                        ₹ {payment?.amount}
                      </td>

                      <td className="p-3">{payment?.paymentMethod}</td>

                      <td className="p-3">{payment?.transactionId}</td>

                      <td className="p-3">
                        {new Date(payment?.paidAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
