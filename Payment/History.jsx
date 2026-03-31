import React, { useEffect, useMemo, useState } from "react";
import api from "../src/api/axios.js";
import { printPaymentReceipt } from "./PaymentReceipt";
import { FEE_TYPE_OPTIONS } from "../src/utils/studentFees";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400";

const formatAmount = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-IN");
};

const History = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payment/received");

      if (res.data.success) {
        setPayments(res.data.data || []);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayment = useMemo(
    () =>
      payments.filter((item) => {
        const payment = item.payment;
        const paymentId = String(payment?.transactionId || payment?._id || "");

        const nameMatch =
          !search ||
          String(payment?.studentName || item.student?.name || "")
            .toLowerCase()
            .includes(search.toLowerCase());

        const idMatch =
          !transactionFilter ||
          paymentId.toLowerCase().includes(transactionFilter.toLowerCase());

        const itemDate = new Date(payment?.paidAt);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (to) {
          to.setHours(23, 59, 59, 999);
        }

        const fromMatch = from ? itemDate >= from : true;
        const toMatch = to ? itemDate <= to : true;

        return nameMatch && idMatch && fromMatch && toMatch;
      }),
    [payments, search, transactionFilter, fromDate, toDate],
  );

  const totalAmount = useMemo(
    () => filteredPayment.reduce((acc, item) => acc + (item.payment?.amount || 0), 0),
    [filteredPayment],
  );

  const handlePrintReceipt = (item) => {
    printPaymentReceipt({
      ...item.student,
      ...item.payment,
      paymentId: item.payment?.transactionId || item.payment?._id,
      studentName: item.payment?.studentName || item.student?.name,
    });
  };



  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Finance Admin
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Payment History
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Review approved collections, filter records quickly, and print
              receipts directly from the history table.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Total Collection
              </p>
              <p className="mt-1 text-2xl font-black">{formatAmount(totalAmount)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Records
              </p>
              <p className="mt-1 text-2xl font-black">{filteredPayment.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            placeholder="Search student name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClassName}
          />

          <input
            type="text"
            placeholder="Transaction id"
            value={transactionFilter}
            onChange={(e) => setTransactionFilter(e.target.value)}
            className={inputClassName}
          />

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
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Directory
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Approved Payments
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {loading ? "Refreshing..." : `${filteredPayment.length} results`}
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading payment history...
          </div>
        ) : (
          <div className="overflow-auto h-[400px]">
            <table className=" w-full" >
              <thead className="bg-slate-100">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Student Name</th>
                  <th className="px-5 py-4">Fee Type</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Payment Method</th>
                  <th className="px-5 py-4">Transaction Id</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-center">Receipt</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPayment.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-sm text-slate-500">
                      No payment history found.
                    </td>
                  </tr>
                ) : (
                  filteredPayment.map((item, index) => (
                    <tr key={index} className="text-sm text-slate-700 hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {item.payment?.studentName || item.student?.name || "-"}
                      </td>
                      <td className="px-5 py-4">
                        {FEE_TYPE_OPTIONS.find((fee) => fee.value === item.payment?.feeType)?.label ||
                          "Tuition Fees"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-emerald-700">
                        {formatAmount(item.payment?.amount)}
                      </td>
                      <td className="px-5 py-4">{item.payment?.paymentMethod || "-"}</td>
                      <td className="px-5 py-4">
                        {item.payment?.transactionId || item.payment?._id || "-"}
                      </td>
                      <td className="px-5 py-4">{formatDate(item.payment?.paidAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => handlePrintReceipt(item)}
                            className="rounded-2xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                          >
                            Print Receipt
                          </button>
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
    </div>
  );
};

export default History;
