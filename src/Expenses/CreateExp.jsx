import React, { useState } from "react";
import api from "../api/axios.js";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400";

const CreateExpense = ({ onCreated }) => {
  const [form, setForm] = useState({
    amount: "",
    name: "",
    paidTo: "",
    paidBy: "",
    mode: "",
    remark: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/expense/createExpense", form);
      setMessage(res.data.message || "Expense added successfully");
      setMessageType("success");
      setForm({
        amount: "",
        name: "",
        paidTo: "",
        paidBy: "",
        mode: "",
        remark: "",
      });
      onCreated?.();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Entry
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Add Expense
          </h2>
        </div>
        <div className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Finance Outflow
        </div>
      </div>

      {message ? (
        <div
          className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${
            messageType === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          className={inputClassName}
        />

        <input
          type="text"
          name="name"
          placeholder="Expense name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClassName}
        />

        <input
          type="text"
          name="paidTo"
          placeholder="Paid to"
          value={form.paidTo}
          onChange={handleChange}
          className={inputClassName}
        />

        <input
          type="text"
          name="paidBy"
          placeholder="Paid by"
          value={form.paidBy}
          onChange={handleChange}
          className={inputClassName}
        />

        <select
          name="mode"
          value={form.mode}
          onChange={handleChange}
          className={inputClassName}
          required
        >
          <option value="">Payment mode</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>

        <input
          name="remark"
          placeholder="Remark"
          value={form.remark}
          onChange={handleChange}
          className={inputClassName}
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 md:col-span-2 xl:col-span-3"
        >
          {loading ? "Saving..." : "Create Expense"}
        </button>
      </form>
    </section>
  );
};

export default CreateExpense;
