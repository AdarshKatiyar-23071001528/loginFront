import React, { useEffect, useMemo, useState } from "react";
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

  const allpayment = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payment/allPayment");

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
    <div className="bg-white shadow-lg overflow-hidden rounded-3xl">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-3xl font-bold text-red-600 ">Payments</h2>

        {notshow ? (
          <div className="bg-black/10 py-4 px-6 rounded-xl shadow-lg border border-gray-400/50">
            <p className="flex justify-start items-left text-gray-500 ">Receive</p>
            <p className="text-3xl font-bold text-green-600">₹ {totalPaid}</p>
          </div>
        ) : null}

        <div className="bg-black/10 py-4 px-6 rounded-xl shadow-lg border border-gray-400/50">
          <p className="flex justify-start items-left text-gray-500 ">Pending</p>
          <p className="text-3xl font-bold text-red-600">₹ {totalPending}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 py-4">
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
              {notshow ? (
                <>
                  <th className="p-3 text-left">Tuition Fees</th>
                  <th className="p-3 text-left">Discount</th>
                  <th className="px-5 py-3 text-left">Total Fees</th>
                  <th className="p-3 text-left">Paid Fees</th>
                </>
              ) : null}
              <th className="p-3 text-left">Pending Fees</th>
              <th className="p-3 text-left">Branch</th>
              <th className="p-3 text-left">Reference</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center p-6">
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

                  {notshow ? (
                    <>
                      <td className="p-3 font-semibold">₹ {item.summary?.tuition?.total || 0}</td>
                      <td className="p-3 font-semibold">₹ {item.discount}</td>
                      <td className="p-3 font-semibold">₹ {item.total}</td>
                      <td className="p-3 text-green-600 font-semibold">₹ {item.paid}</td>
                    </>
                  ) : null}

                  <td className="p-3 text-red-600 font-semibold">₹ {item.pending}</td>
                  <td className="p-3">{item.branch}</td>
                  <td className="p-3">{item.reference}</td>
                  <td className="p-3">
                    {item.pending > 0 ? (
                      <button
                        onClick={() => payStudent(item)}
                        className="bg-green-500 text-white px-4 py-1 rounded"
                      >
                        Pay
                      </button>
                    ) : (
                      <button disabled>Fully Paid</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {pay ? (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-[450px] relative">
            <button
              onClick={() => setPay(false)}
              className="absolute right-4 top-2 text-xl"
            >
              x
            </button>

            <h2 className="text-xl font-bold mb-2">{paid?.name}</h2>
            <p className="text-red-500 mb-4">Pending : ₹ {paid ? paid.pending : 0}</p>

            <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              {(paid?.list || []).map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3 py-1">
                  <span>{item.label}</span>
                  <span className="font-semibold text-red-600">₹ {item.pending}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <select
                name="feeType"
                onChange={handleChange}
                value={formData.feeType}
                className="border p-2 rounded"
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
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              />

              <select
                name="paymentMethod"
                onChange={handleChange}
                value={formData.paymentMethod}
                className="border p-2 rounded"
              >
                <option value="" disabled>
                  Payment Method
                </option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank">Bank</option>
              </select>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded"
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
