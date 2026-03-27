import React, { useEffect, useMemo, useState } from "react";
import api from "../src/api/axios";
import { FEE_TYPE_OPTIONS } from "../src/utils/studentFees";

const formatAmount = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-IN");
};

const PendingRequest = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/student/pendingPayments");
      const data = response.data;

      if (data.success && Array.isArray(data.pending)) {
        const payments = [];
        data.pending.forEach((student) => {
          if (student.payments && Array.isArray(student.payments)) {
            student.payments.forEach((payment) => {
              if (payment.status === "pending") {
                payments.push({
                  ...payment,
                  studentName: student.name,
                  studentId: student._id,
                });
              }
            });
          }
        });
        setPendingPayments(payments);
      } else if (response.data && response.data.payments) {
        setPendingPayments(response.data.payments);
      } else {
        setPendingPayments([]);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (studentId, paymentId) => {
    try {
      const response = await api.put("/student/approve/payment", {
        studentId,
        paymentId,
      });
      if (response.data.success) {
        fetchPendingPayments();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRejectPayment = async (studentId, paymentId) => {
    try {
      const response = await api.put("/student/reject/payment", {
        studentId,
        paymentId,
      });
      if (response.data.success) {
        fetchPendingPayments();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const totalRequested = useMemo(
    () => pendingPayments.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [pendingPayments],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
              Finance Admin
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Payment Requests
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Review student-uploaded payment proofs and approve or reject each
              request from one clean approval queue.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Pending Requests
              </p>
              <p className="mt-1 text-2xl font-black">{pendingPayments.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Requested Amount
              </p>
              <p className="mt-1 text-2xl font-black">{formatAmount(totalRequested)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Approval Queue
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Pending Verification
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {loading ? "Refreshing..." : `${pendingPayments.length} requests`}
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading payment requests...
          </div>
        ) : pendingPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Student Name</th>
                  <th className="px-5 py-4">Fee Type</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Receipt / Transaction Id</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingPayments.map((payment) => (
                  <tr key={payment._id} className="text-sm text-slate-700 hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {payment.studentName || "-"}
                    </td>
                    <td className="px-5 py-4">
                      {FEE_TYPE_OPTIONS.find((fee) => fee.value === payment.feeType)?.label ||
                        "Tuition Fees"}
                    </td>
                    <td className="px-5 py-4 font-semibold text-amber-700">
                      {formatAmount(payment.amount)}
                    </td>
                    <td className="px-5 py-4">{payment.paymentMethod || "-"}</td>
                    <td className="px-5 py-4 font-semibold text-rose-700">
                      {payment.transactionId || "-"}
                    </td>
                    <td className="px-5 py-4">{formatDate(payment.paidAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprovePayment(payment.studentId, payment._id)}
                          className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectPayment(payment.studentId, payment._id)}
                          className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            No payment requests pending right now.
          </div>
        )}
      </section>
    </div>
  );
};

export default PendingRequest;
