import React, { useEffect, useMemo, useState } from "react";
import api from "../src/api/axios";
import { getFeeTotals } from "../src/utils/studentFees";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400";

const formatAmount = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

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
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-200">
              Finance Admin
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Pending Payments
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Track outstanding balances, review fee breakdowns, and identify
              the students with the highest pending dues.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Outstanding Total
              </p>
              <p className="mt-1 text-2xl font-black">{formatAmount(totalPending)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Students
              </p>
              <p className="mt-1 text-2xl font-black">{filteredStudents.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            placeholder="Search enrollment"
            value={enrollFilter}
            onChange={(e) => setEnrollFilter(e.target.value)}
            className={inputClassName}
          />

          <input
            type="text"
            placeholder="Search reference"
            value={referenceFilter}
            onChange={(e) => setReferenceFilter(e.target.value)}
            className={inputClassName}
          />

          <input
            type="text"
            placeholder="Search branch"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className={inputClassName}
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={inputClassName}
          >
            <option value="desc">Highest pending</option>
            <option value="asc">Lowest pending</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Directory
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Outstanding Fee List
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {loading ? "Refreshing..." : `${filteredStudents.length} results`}
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading pending payments...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Enrollment</th>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Class</th>
                  <th className="px-5 py-4">Pending</th>
                  <th className="px-5 py-4">Fee Breakdown</th>
                  <th className="px-5 py-4">Branch</th>
                  <th className="px-5 py-4">Reference</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-sm text-slate-500">
                      No pending payment data found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((item) => (
                    <tr key={item._id} className="text-sm text-slate-700 hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {item.enrollment || "-"}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {item.name || "-"}
                      </td>
                      <td className="px-5 py-4">
                        {item.course || "-"}/{item.semester || "-"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-rose-700">
                        {formatAmount(item.pending)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.list
                          .filter((fee) => fee.pending > 0)
                          .map((fee) => `${fee.label}: ${formatAmount(fee.pending)}`)
                          .join(", ") || "-"}
                      </td>
                      <td className="px-5 py-4">{item.branch || "-"}</td>
                      <td className="px-5 py-4">{item.reference || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default PendingPayment;
