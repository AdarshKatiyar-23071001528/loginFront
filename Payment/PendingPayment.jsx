import React, { useEffect, useMemo, useState } from "react";
import api from "../src/api/axios";
import { getFeeTotals } from "../src/utils/studentFees";

const PendingPayment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrollFilter, setEnrollFilter] = useState("");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payment/pending");

      if (response.data.success) {
        const cleanData = (response.data.pending || []).map((student) => ({
          ...student,
          name: student.name || "",
          reference: student.reference || "",
          branch: student.branch || "",
          enrollment: student.enrollment || "",
          ...getFeeTotals(student),
        }));

        setStudents(cleanData);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const data = students.filter((item) => {
      const enrollment = String(item.enrollment || "").toLowerCase();
      const reference = String(item.reference || "").toLowerCase();
      const branch = String(item.branch || "").toLowerCase();

      return (
        enrollment.includes(enrollFilter.toLowerCase()) &&
        reference.includes(referenceFilter.toLowerCase()) &&
        branch.includes(branchFilter.toLowerCase())
      );
    });

    data.sort((a, b) =>
      sortOrder === "asc" ? a.pending - b.pending : b.pending - a.pending,
    );

    return data;
  }, [students, enrollFilter, referenceFilter, branchFilter, sortOrder]);

  const totalPending = useMemo(
    () => filteredStudents.reduce((sum, item) => sum + item.pending, 0),
    [filteredStudents],
  );

  return (
    <div className="bg-white shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-3xl font-bold text-red-600">Pending Payments</h2>
        <p className="text-3xl font-bold text-red-600">₹{totalPending}</p>
      </div>

      <div className="flex flex-wrap gap-3 p-4">
        <input
          type="text"
          placeholder="Search Enrollment"
          value={enrollFilter}
          onChange={(e) => setEnrollFilter(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Search Reference"
          value={referenceFilter}
          onChange={(e) => setReferenceFilter(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Search Branch"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="desc">Highest Pending</option>
          <option value="asc">Lowest Pending</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center p-6">Loading...</p>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Enrollment</th>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Pending</th>
              <th className="p-3 text-left">Fee Breakdown</th>
              <th className="p-3 text-left">Branch</th>
              <th className="p-3 text-left">Reference</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6">
                  No Data Found
                </td>
              </tr>
            ) : (
              filteredStudents.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.enrollment}</td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">
                    {item.course}/{item.semester}
                  </td>
                  <td className="p-3 text-red-600 font-semibold">₹{item.pending}</td>
                  <td className="p-3 text-sm text-slate-600">
                    {item.list
                      .filter((fee) => fee.pending > 0)
                      .map((fee) => `${fee.label}: ₹${fee.pending}`)
                      .join(", ") || "-"}
                  </td>
                  <td className="p-3">{item.branch}</td>
                  <td className="p-3">{item.reference}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingPayment;
