import React, { useState } from "react";
import api from '../api/axios.js'

const CreateExpense = () => {

  const [form, setForm] = useState({
    amount: "",
    name: "",
    paidTo: "",
    paidBy: "",
    mode: "",
    remark: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await api.post(
        "/expense/createExpense",form
      );

      setSuccess(res.data.message);

      setForm({
        amount: "",
        name: "",
        paidTo: "",
        paidBy: "",
        mode: "",
        remark: ""
      });

    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex  w-full">

      <div className=" shadow-xl p-2 transform transition-all duration-300 w-full h-[100px] flex items-center justify-center rounded bg-white">


        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className=" flex gap-2 ">

          <div>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-[100px] scrollbar-none py-2 px-2 text-decoration-none rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border"
            />
          </div>

          <div>
            <input
              type="text"
              name="name"
              placeholder="Expense Name"
              value={form.name}
              onChange={handleChange}
              className="w-full scrollbar-none py-2 px-2 text-decoration-none rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border"
            />
          </div>

          <div>
            <input
              type="text"
              name="paidTo"
              placeholder="Paid To"
              value={form.paidTo}
              onChange={handleChange}
              className="w-full scrollbar-none py-2 px-2 text-decoration-none rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border" 
            />
          </div>

          <div>
            <input
              type="text"
              name="paidBy"
              placeholder="Paid By"
              value={form.paidBy}
              onChange={handleChange}
              className="w-full scrollbar-none py-2 px-2 text-decoration-none rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border"
            />
          </div>

          <div>
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="w-full scrollbar-none py-2 px-2 text-decoration-none rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border"
            >
              <option value="">Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div>
            <input
              name="remark"
              placeholder="Remark"
              value={form.remark}
              onChange={handleChange}
              className="w-full scrollbar-none py-2 px-2 text-decoration-none rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition duration-200 rounded"
            >
              {loading ? "..." : "+"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateExpense;