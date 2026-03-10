import React, { useEffect, useMemo, useState } from "react";
import api from "../src/api/axios";

const PendingPayment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payment/pending");

      if (response.data.success) {
        setStudents(response.data.pending);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  // unique branches for dropdown
  const branches = useMemo(() => {
    return [...new Set(students.map((s) => s.branch))];
  }, [students]);

  // filtered students
  const filteredStudents = useMemo(() => {
    let data = students.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.branch.toLowerCase().includes(search.toLowerCase()) ||
        item.reference.toLowerCase().includes(search.toLowerCase()),
    );

    if (branch) {
      data = data.filter((item) => item.branch === branch);
    }

    data.sort((a, b) => {
      const aPending = a.totalfees - a.paidfees;
      const bPending = b.totalfees - b.paidfees;

      return sortOrder === "asc" ? aPending - bPending : bPending - aPending;
    });

    return data;
  }, [students, search, branch, sortOrder]);

  // total pending
  const totalPending = useMemo(() => {
    return filteredStudents.reduce(
      (sum, item) => sum + (item.totalfees - item.paidfees),
      0,
    );
  }, [filteredStudents]);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header */}

      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-3xl font-bold text-red-600">Pending Payments</h2>

        <p className="text-3xl font-bold text-red-600">₹{totalPending}</p>
      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-3 p-4">
        <input
          type="text"
          placeholder="Search name / branch / reference"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Branch</option>
          {branches.map((b, i) => (
            <option key={i} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="desc">Highest Pending</option>
          <option value="asc">Lowest Pending</option>
        </select>
      </div>

      {/* Loading */}

      {loading ? (
        <p className="text-center p-6">Loading...</p>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Pending</th>
              <th className="p-3 text-left">Branch</th>
              <th className="p-3 text-left">Reference</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((item) => {
              const pending = item.totalfees - item.paidfees;

              return (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.name}</td>

                  <td className="p-3">
                    {item.course}/{item.semester}
                  </td>

                  <td className="p-3 text-red-600 font-semibold">₹{pending}</td>

                  <td className="p-3">{item.branch}</td>

                  <td className="p-3">{item.reference}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingPayment;
