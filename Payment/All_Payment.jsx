import React, { useEffect, useMemo, useState } from "react";
import api from "../src/api/axios";

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
transactionId: "",
paymentMethod: ""
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
    transactionId: formData.transactionId,
    screenshot: "image"
  });

  if (res.data.success) {

    alert("Payment Successful");

    setFormData({
      amount: "",
      transactionId: "",
      paymentMethod: ""
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

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

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

          <input
            type="text"
            name="transactionId"
            placeholder="Transaction ID / Receipt"
            value={formData.transactionId}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          


          <select name="paymentMethod" id="" onChange={handleChange} value={formData.paymentMethod}
          className="border p-2 rounded">
            <option selected disabled>Payment Method</option>
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
