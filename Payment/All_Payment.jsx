import React, { useContext, useEffect, useMemo, useState } from "react";
import api from "../src/api/axios";
import { printPaymentReceipt } from "./PaymentReceipt";
import { FEE_TYPE_OPTIONS, getFeeTotals } from "../src/utils/studentFees";


const getSafeAssetValue = (value) => {

 
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (raw.startsWith("data:image/")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return raw;
  return null;
};

const inputClassName =
  "rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400";

const All_Payment = ({ notshow }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrollFilter, setEnrollFilter] = useState("");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pay, setPay] = useState(false);
  const [paid, setPaid] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    feeType: "tuition",
    paymentMethod: "Cash",
  });

  useEffect(() => {
    allpayment();
  }, []);


  

  // Fetch all payment records and calculate fee summaries

  

  const allpayment = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payment/allPayment");
      console.log(response.data.all);

      
      if (response.data.success) {
      
        const list = response.data.all || [];
        const cleanData = list.map((student) => ({
          ...student,
          enrollment: student.enrollment || "",
          name: student.name || "",
          fathername: student.fathername || "",
          course: student.course || "",
          semester: student.semester || "",
          reference: student.reference || "",
          branch: student.branch || "",
          discount: student.discount || 0,
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

  const payStudent = (item) => {
    setPaid(item);
    setPay(true);
    setFormData({
      amount: "",
      feeType: "tuition",
      paymentMethod: "Cash",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paid) return;

    const amount = Number(formData.amount);
    const selectedFee = paid.summary?.[formData.feeType] || { pending: 0 };

    if (amount > paid.pending) {
      alert("Amount cannot be greater than pending fees");
      return;
    }

    if (amount > Number(selectedFee.pending || 0)) {
      alert("Amount cannot be greater than pending amount of selected fee type");
      return;
    }

    try {
      const res = await api.put("/student/finance/payment", {
        studentId: paid._id,
        studentName: paid.name,
        amount,
        feeType: formData.feeType,
        paymentMethod: formData.paymentMethod,
        screenshot: getSafeAssetValue(paid?.screenshot),
      });

      if (res.data.success) {
        const updatedStudent = res.data.student || paid;
        const payment = res.data.payment || {};

        printPaymentReceipt({
          ...updatedStudent,
          amount: payment.amount || amount,
          feeType: payment.feeType || formData.feeType,
          paymentMethod: payment.paymentMethod || formData.paymentMethod || "Cash",
          paymentId: payment.transactionId || payment._id || "",
          paidAt: payment.paidAt || new Date(),
          studentName: updatedStudent.name,
        });

        alert("Payment Successful");
        setPay(false);
        allpayment();
      }
    } catch (err) {
      console.log(err.message);
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

  const totalPaid = useMemo(
    () => filteredStudents.reduce((sum, item) => sum + item.paid, 0),
    [filteredStudents],
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
              Fee Collection
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Search students, review pending balances, and collect fees with a
              cleaner payment operations screen.
            </p>
          </div>

          <div className={`grid gap-3 ${notshow ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
            {notshow ? (
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  Received
                </p>
                <p className="mt-1 text-2xl font-black">Rs. {totalPaid}</p>
              </div>
            ) : null}
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Pending
              </p>
              <p className="mt-1 text-2xl font-black">Rs. {totalPending}</p>
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
              Student Payments
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {loading ? "Refreshing..." : `${filteredStudents.length} results`}
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading payment records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Enrollment</th>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Class</th>
                  {notshow ? (
                    <>
                      <th className="px-5 py-4">Tuition</th>
                      <th className="px-5 py-4">Discount</th>
                      <th className="px-5 py-4">Total</th>
                      <th className="px-5 py-4">Paid</th>
                    </>
                  ) : null}
                  <th className="px-5 py-4">Pending</th>
                  {/* <th className="px-5 py-4">Branch</th>
                  <th className="px-5 py-4">Reference</th> */}
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-5 py-10 text-center text-sm text-slate-500">
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((item) => (
                    <tr
                      key={item._id}
                      className="text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {item.enrollment || "-"}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {item.name || "-"}
                      </td>
                      <td className="px-5 py-4">
                        {item.course || "-"}/{item.semester || "-"}
                      </td>
                      {notshow ? (
                        <>
                          <td className="px-5 py-4 font-semibold">
                            Rs. {item.summary?.tuition?.total || 0}
                          </td>
                          <td className="px-5 py-4 font-semibold">
                            Rs. {item.discount || 0}
                          </td>
                          <td className="px-5 py-4 font-semibold">
                            Rs. {item.total || 0}
                          </td>
                          <td className="px-5 py-4 font-semibold text-emerald-700">
                            Rs. {item.paid || 0}
                          </td>
                        </>
                      ) : null}
                      <td className="px-5 py-4 font-semibold text-rose-700">
                        Rs. {item.pending || 0}
                      </td>
                      {/* <td className="px-5 py-4">{item.branch || "-"}</td> */}
                      {/* <td className="px-5 py-4">{item.reference || "-"}</td> */}
                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          {item.pending > 0 ? (
                            <button
                              type="button"
                              onClick={() => payStudent(item)}
                              className="rounded-2xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                            >
                              Pay
                            </button>
                          ) : (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Fully Paid
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pay ? (
        <div className="fixed inset-0 z-50 bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Collect Payment
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {paid?.name || "Student"}
                </h2>
                <p className="mt-2 text-sm font-semibold text-rose-600">
                  Pending: Rs. {paid ? paid.pending : 0}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPay(false)}
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm">
              {(paid?.list || []).map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-semibold text-rose-700">
                    Rs. {item.pending}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
              <select
                name="feeType"
                onChange={handleChange}
                value={formData.feeType}
                className={inputClassName}
              >
                {FEE_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className={inputClassName}
              />

              <select
                name="paymentMethod"
                onChange={handleChange}
                value={formData.paymentMethod}
                className={inputClassName}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank">Bank</option>
              </select>

              <button
                type="submit"
                className="rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Submit Payment
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default All_Payment;
