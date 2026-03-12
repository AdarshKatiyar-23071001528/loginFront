import React, { useEffect, useState } from 'react'
import api from '../src/api/axios';

const PendingRequest = () => {
 const [pendingPayments, setPendingPayments] = useState([]);
  const handleApprovePayment = async (studentId, paymentId) => {
     try {
       const response = await api.put(`/student/approve/payment`, {
         studentId,
         paymentId,
       });
       if (response.data.success) {
         
         fetchPendingPayments();
         setTimeout(() => setMessage(""), 3000);
       }
     } catch (error) {
       console.log(error.message);
     }
   };
 
   // Reject payment
   const handleRejectPayment = async (studentId, paymentId) => {
     try {
       const response = await api.put(`/student/reject/payment`, {
         studentId,
         paymentId,
       });
       if (response.data.success) {
       
         fetchPendingPayments();
         setTimeout(() => setMessage(""), 3000);
       }
     } catch (error) {
       console.log(error.message);
     }
   };
 


    useEffect(()=>{
        fetchPendingPayments();
    },[])

     const fetchPendingPayments = async () => {
    try {
      
      const response = await api.get(`/student/pendingPayments`);
      // backend returns { success: true, pending: [...] }
      const data = response.data;
      if (data.success && Array.isArray(data.pending)) {
        const payments = [];
        data.pending.forEach((student) => {
          if (student.payments && Array.isArray(student.payments)) {
            student.payments.forEach((p) => {
              if (p.status === "pending") {
                payments.push({
                  ...p,
                  studentName: student.name,
                  studentId: student._id,
                });
              }
            });
          }
        });
        setPendingPayments(payments);
      } else if (Array.isArray(data)) {
        // fallback for older response format as array
        const payments = [];
        data.forEach((student) => {
          if (student.payments && Array.isArray(student.payments)) {
            student.payments.forEach((p) => {
              if (p.status === "pending") {
                payments.push({
                  ...p,
                  studentName: student.name,
                  studentId: student._id,
                });
              }
            });
          }
        });
        setPendingPayments(payments);
      } else if (response.data && response.data.payments) {
        // fallback for older shape
        setPendingPayments(response.data.payments);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  




  return (
    <div className='bg-white shadow-lg  overflow-hidden'>

        {pendingPayments.length > 0 ? <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Receipt/transaction Id</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              pendingPayments.map((payment) => (
               

                
                  <tr key={payment._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{payment.studentName}</td>
                    <td className="p-3 font-medium">₹{payment.amount}</td>

                    <td className="p-3">
                      {payment.paymentMethod}
                    </td>

                    <td className="p-3 text-red-600 font-semibold">
                      {payment.transactionId}
                    </td>

                    <td className="p-3">{payment.paidAt
                                      ? new Date(
                                          payment.paidAt,
                                        ).toLocaleDateString("en-IN")
                                      : "N/A"}</td>

                    <td className="p-3 gap-2 flex"><button
                                  onClick={() =>
                                    handleApprovePayment(
                                      payment.studentId,
                                      payment._id,
                                    )
                                  }
                                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleRejectPayment(
                                      payment.studentId,
                                      payment._id,
                                    )
                                  }
                                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold"
                                >
                                  Reject
                                </button></td>
                  </tr>
                
              ))}
          </tbody>
        </table>
        :<div className='bg-gray-400 p-4 rounded-xl flex items-center justify-center text-rose-700 font-bold'>No One Request</div>}
      
    </div>
  )
}

export default PendingRequest
