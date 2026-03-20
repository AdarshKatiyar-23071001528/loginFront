import React, { useEffect, useMemo, useState } from "react";
import api from "../src/api/axios";

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatReceiptDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const All_Payment = () => {

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
paymentMethod: "Cash"
});

useEffect(() => {
allpayment();
}, []);

const allpayment = async () => {
try {


  setLoading(true);

  const response = await api.get("/payment/allPayment");

  console.log(response.data);

  if (response.data.success) {

    const list = response.data.all || [];

    const cleanData = list.map((d) => ({
      ...d,
      enrollment:d.enrollment || "",
      name: d.name || "",
      fathername: d.fathername || "",
      course: d.course || "",
      semester: d.semester || "",
      reference: d.reference || "",
      branch: d.branch || "",
      totalfees: d.totalfees || 0,
      paidfees: d.paidfees || 0
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
};

const openReceiptPrint = (receipt, receiptWindow) => {
  const paymentId = receipt?.paymentId || receipt?._id || "-";
  const receiptDate = formatReceiptDate(receipt?.paidAt);
  const amountPaid = Number(receipt?.amount || 0);
  const pendingAfter = Number(receipt?.pendingAfter ?? receipt?.pending ?? 0);
  const totalFees = Number(receipt?.totalfees || 0);
  const totalPaid = Number(receipt?.paidfees || 0);
  const studentName = escapeHtml(receipt?.name || "-");
  const fatherName = escapeHtml(receipt?.fathername || "-");
  const course = escapeHtml(receipt?.course || "-");
  const semester = escapeHtml(receipt?.semester || "-");
  const enrollment = escapeHtml(receipt?.enrollment || "-");
  const branch = escapeHtml(receipt?.branch || "-");
  const reference = escapeHtml(receipt?.reference || "-");
  const paymentMethod = escapeHtml(receipt?.paymentMethod || "-");
  const receiptHtml = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Fee Receipt</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 16px;
            font-family: Arial, Helvetica, sans-serif;
            background: #f3f4f6;
            color: #111827;
          }
          .sheet {
            display: flex;
            gap: 14px;
            align-items: stretch;
          }
          .receipt {
            flex: 1;
            background: white;
            border: 2px solid #111827;
            border-radius: 14px;
            padding: 16px;
            min-height: 100%;
          }
          .head {
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 10px;
            margin-bottom: 12px;
            text-align: center;
          }
          .head h1 {
            margin: 0;
            font-size: 20px;
            letter-spacing: 0.08em;
          }
          .head p {
            margin: 4px 0 0;
            font-size: 12px;
            color: #4b5563;
          }
          .copy {
            margin-top: 6px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 12px;
            font-size: 13px;
          }
          .field {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 8px 10px;
            background: #fafafa;
          }
          .label {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #6b7280;
            margin-bottom: 4px;
          }
          .value {
            font-size: 13px;
            font-weight: 700;
            color: #111827;
            word-break: break-word;
          }
          .summary {
            margin-top: 12px;
            border-top: 1px dashed #d1d5db;
            padding-top: 12px;
            display: grid;
            gap: 8px;
          }
          .summaryRow {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            font-size: 13px;
          }
          .summaryRow strong {
            min-width: 120px;
          }
          .footer {
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid #d1d5db;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            font-size: 12px;
            color: #4b5563;
          }
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .sheet {
              gap: 10px;
            }
            .receipt {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          ${["Office Copy", "Student Copy"]
            .map(
              (copyName) => `
                <div class="receipt">
                  <div class="head">
                    <h1>FEE RECEIPT</h1>
                    <p>Unique payment id is used as the transaction id</p>
                    <div class="copy">${escapeHtml(copyName)}</div>
                  </div>

                  <div class="grid">
                    <div class="field"><span class="label">Receipt / Transaction ID</span><span class="value">${escapeHtml(paymentId)}</span></div>
                    <div class="field"><span class="label">Date</span><span class="value">${escapeHtml(receiptDate)}</span></div>
                    <div class="field"><span class="label">Student Name</span><span class="value">${studentName}</span></div>
                    <div class="field"><span class="label">Father Name</span><span class="value">${fatherName}</span></div>
                    <div class="field"><span class="label">Class / Course</span><span class="value">${course}</span></div>
                    <div class="field"><span class="label">Semester</span><span class="value">${semester}</span></div>
                    <div class="field"><span class="label">Enrollment</span><span class="value">${enrollment}</span></div>
                    <div class="field"><span class="label">Branch</span><span class="value">${branch}</span></div>
                    <div class="field"><span class="label">Reference</span><span class="value">${reference}</span></div>
                    <div class="field"><span class="label">Payment Method</span><span class="value">${paymentMethod}</span></div>
                  </div>

                  <div class="summary">
                    <div class="summaryRow"><strong>Total Fees</strong><span>${escapeHtml(formatMoney(totalFees))}</span></div>
                    <div class="summaryRow"><strong>Previous Paid</strong><span>${escapeHtml(formatMoney(receipt?.previousPaid ?? (totalPaid - amountPaid)))}</span></div>
                    <div class="summaryRow"><strong>Amount Paid</strong><span>${escapeHtml(formatMoney(amountPaid))}</span></div>
                    <div class="summaryRow"><strong>Pending After</strong><span>${escapeHtml(formatMoney(pendingAfter))}</span></div>
                  </div>

                  <div class="footer">
                    <span>Generated by ERP Finance Module</span>
                    <span>Keep this receipt for record</span>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      </body>
    </html>
  `;

  const printWindow = receiptWindow || window.open("", "_blank", "width=1400,height=900");
  if (!printWindow) {
    alert("Popup blocked. Please allow popups to print the receipt.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(receiptHtml);
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

const handleChange = (e) => {


const { name, value } = e.target;

setFormData((prev) => ({
  ...prev,
  [name]: value
}));


};

const handleSubmit = async (e) => {


e.preventDefault();

if (!paid) return;

const pending = paid.totalfees - paid.paidfees;


if (Number(formData.amount) > pending) {
  alert("Amount cannot be greater than pending fees");
  return;
}

try {

  const res = await api.put("/student/finance/payment", {
    studentId: paid._id,
    studentName : paid.name,
    amount: Number(formData.amount),
    paymentMethod: formData.paymentMethod,
    screenshot: "image"
  });

  if (res.data.success) {
    console.log(res);

    alert("Payment Successful");

    const updatedStudent = res.data.student || paid;
    const payment = res.data.payment || {};
    const amountPaid = Number(formData.amount);
    const previousPaid = Number(updatedStudent.paidfees || 0) - amountPaid;
    const pendingAfter = Number(updatedStudent.totalfees || 0) - Number(updatedStudent.paidfees || 0);

    openReceiptPrint({
      ...updatedStudent,
      amount: payment.amount || amountPaid,
      paymentMethod: payment.paymentMethod || formData.paymentMethod || "Cash",
      paymentId: payment.transactionId || payment._id || "",
      paidAt: payment.paidAt || new Date(),
      pending: pendingAfter,
      previousPaid,
    });

    setFormData({
      amount: "",
      paymentMethod: "Cash"
    });

    setPay(false);

    allpayment();

  }

} catch (err) {

  console.log(err.message);

}


};


  // Filter + Sort
  const filteredStudents = useMemo(() => {
    let data = students.filter((item) => {
      const enrollment = item.enrollment.toLowerCase();
      const reference = item.reference.toLowerCase();
      const branch = item.branch.toLowerCase();

      return (
        enrollment.includes(enrollFilter.toLowerCase()) &&
        reference.includes(referenceFilter.toLowerCase()) &&
        branch.includes(branchFilter.toLowerCase())
      );
    });

    data.sort((a, b) => {
      const aPending = a.totalfees - a.paidfees;
      const bPending = b.totalfees - b.paidfees;

      return sortOrder === "asc" ? aPending - bPending : bPending - aPending;
    });

    return data;
  }, [students, enrollFilter, referenceFilter, branchFilter, sortOrder]);

const totalPending = useMemo(() => {
return filteredStudents.reduce(
  (sum, item) => sum + (item.totalfees - item.paidfees),
  0
);


}, [filteredStudents]);

const totalPaid = useMemo(() => {
  return filteredStudents.reduce((sum,item) => sum + item.paidfees, 0)
},[filteredStudents])
return (


<div className="bg-white shadow-lg overflow-hidden">

  <div className="flex justify-between items-center p-4 border-b">

    <h2 className="text-3xl font-bold text-red-600">
    Payments
    </h2>

    <p className="text-3xl font-bold text-green-600">
      ₹{totalPaid}
    </p>
    <p className="text-3xl font-bold text-red-600">
      ₹{totalPending}
    </p>

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
          <th className="p-3 text-left">Total Fees</th>
          <th className="p-3 text-left">Paid Fees</th>
          <th className="p-3 text-left">Pending Fees</th>
          <th className="p-3 text-left">Branch</th>
          <th className="p-3 text-left">Reference</th>
          <th className="p-3 text-left">Action</th>
        </tr>

      </thead>

      <tbody>

        {filteredStudents.length === 0 ? (

          <tr>
            <td colSpan="8" className="text-center p-6">
              No Data Found
            </td>
          </tr>

        ) : (

          filteredStudents.map((item) => {

            const pending = item.totalfees - item.paidfees;

            return (

              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">
                  {item.enrollment}
                </td>

                <td className="p-3 font-medium">
                  {item.name}
                </td>

                <td className="p-3">
                  {item.course}/{item.semester}
                </td>

                <td className="p-3 font-semibold">
                  ₹{item.totalfees}
                </td>

                <td className="p-3 text-green-600 font-semibold">
                  ₹{item.paidfees}
                </td>

                <td className="p-3 text-red-600 font-semibold">
                  ₹{pending}
                </td>

                <td className="p-3">
                  {item.branch}
                </td>

                <td className="p-3">
                  {item.reference}
                </td>

                <td className="p-3">
                {pending > 0 ? <button
                    onClick={() => payStudent(item)}
                    className="bg-green-500 text-white px-4 py-1 rounded"
                  >
                    Pay
                  </button> 
                  : <button disabled>Fully Paid</button>}

                  

                </td>

              </tr>

            );

          })

        )}

      </tbody>

    </table>

  )}

  {pay && (

    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center">

      <div className="bg-white p-4 rounded-lg w-[450px] relative">

        <button
          onClick={() => setPay(false)}
          className="absolute right-4 top-2 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2">
          {paid?.name}
        </h2>

        <p className="text-red-500 mb-4">
          Pending : ₹{paid ? paid.totalfees - paid.paidfees : 0}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >

          <input
            type="number"
            name="amount"
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <select name="paymentMethod" id="" onChange={handleChange} value={formData.paymentMethod}
          className="border p-2 rounded">
            <option value="" disabled>Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
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

  )}

</div>


);
};

export default All_Payment;
