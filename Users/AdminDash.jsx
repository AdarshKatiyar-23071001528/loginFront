import React, { useState, useContext, useEffect, act } from "react";

import {
  FaHome,
  FaMoneyBillAlt,
  FaTrash,
  FaEdit,
  FaMoneyBillWave,
  FaBook,
  FaBell,
  FaUserGraduate,
} from "react-icons/fa";
import { PiStudent } from "react-icons/pi";

import { FcMoneyTransfer } from "react-icons/fc";
import AppContext from "../src/Context/AppContext";
import api from "../src/api/axios";
import StudentRegister from "../src/Student/StudentRegister";
import SubjectManagement from "./SubjectManagement";
import TeacherRegister from "../src/Teacher/TeacherRegister";
import AllStudents from "./AllStudents";
import PaymentChart from "./PaymentChart";
import TotalStudent from "./TotalStudent";
import AllTeachers from "./AllTeachers";
import TodayCollection from "./TodayCollection";
import { Navigate, useNavigate } from "react-router-dom";
import Box from "./Box";
import { CiLogout } from "react-icons/ci";
import Expense from "../src/Expenses/Expense";
import All from "../src/Expenses/All";
import Dashboard from "../Payment/Dashboard";
import FinanceGraph from "../Admin/FinanceGraph";
import PendingPayment from "../Payment/PendingPayment";
import All_Payment from "../Payment/All_Payment";
import History from "../Payment/History";
import PendingRequest from "../Payment/PendingRequest";
import SendMessage from "../Message/SendMessage";
import NoticeManagement from "../Notice/NoticeManagement";
import CreateExpense from "../src/Expenses/CreateExp";
import StudentDash from "../src/StudentForAdmin/StudentDash";
import TeacherDash from "../src/TeacherForAdmin/TeacherDash";


// using configured api instance from src/api/axios

const AdminDash = () => {
  let navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectStudent, setSelectStudent] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [subActivePage, setSubActivePage] = useState("");
  const [teacher, setTeacher] = useState(false);

  const [editTeacher, setEditTeacher] = useState(null);
  const [studentInCollege, setStudentInCollege] = useState(0);
  const [totalTeacherInCollege, setTotalTeacherInCollege] = useState(0);

  // Student management states
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  //
  const [pendingPaymentStudent, setPendingPaymentStudent] = useState([]);
  const [receivedPayments, setReceivedPayments] = useState([]);
  const [rejectPaymentStudents, setRejectPaymentStudents] = useState([]);

  // Modal states for edit
  const [showStudentEditModal, setShowStudentEditModal] = useState(false);
  const [showTeacherEditModal, setShowTeacherEditModal] = useState(false);
  const [editStudentForm, setEditStudentForm] = useState({});
  const [editTeacherForm, setEditTeacherForm] = useState({});

  // Load students on mount
  useEffect(() => {
    if (activePage === "student") {
      fetchAllStudents();
    } else if (activePage === "teacher") {
      fetchAllTeachers();
    } else if (activePage === "payment") {
      fetchPendingPayments();
      receivedPayment();
      pendingPayment();
      rejectPayment();
    } else if (activePage === "home") {
      totalPaidPayment();
      totalPendingPayment();
      fetchAllStudents();
      fetchAllTeachers();
    }
  }, [activePage]);

  // Fetch all students
  const fetchAllStudents = async () => {
    console.log("Fetching all students...");
    try {
      setLoading(true);
      console.log("Fetching students from /student/allStudents");
      const response = await api.get(`/student/allStudents`);
      console.log("Students response:", response.data);
      if (response.data.success) {
        setStudents(response.data.students);
        setStudentInCollege(response.data.students.length);
        console.log("Students set in state:", response.data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage("Error fetching students: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all teachers
  const fetchAllTeachers = async () => {
    try {
      setLoading(true);
      console.log("Fetching teachers from /teacher/allteacher");
      const response = await api.get(`/teacher/allteacher`);
      console.log("Teachers response:", response.data);
      if (response.data.success) {
        setTeachers(response.data.teachers);
        setTotalTeacherInCollege(response.data.teachers.length);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setMessage("Error fetching teachers: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending payments
  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
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
      setMessage("Error fetching payments: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await api.delete(
          `/student/profile/delete/${studentId}`,
        );
        if (response.data.success) {
          setMessage("Student deleted successfully");
          setStudents(students.filter((s) => s._id !== studentId));
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        setMessage("Error deleting student: " + error.message);
      }
    }
  };

  // Delete teacher
  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        const response = await api.delete(`/teacher/delete/${teacherId}`);
        if (response.data.success) {
          setMessage("Teacher deleted successfully");
          setTeachers(teachers.filter((t) => t._id !== teacherId));
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        setMessage("Error deleting teacher: " + error.message);
      }
    }
  };

  // Start editing student
  const handleEditStudent = (student) => {
    setEditStudent(student);
    setEditStudentForm(student);
    setShowStudentEditModal(true);
  };

  // Start editing teacher
  const handleEditTeacher = (teacherData) => {
    setEditTeacher(teacherData);
    setEditTeacherForm(teacherData);
    setShowTeacherEditModal(true);
  };

  // Update student
  const handleUpdateStudent = async () => {
    try {
      const response = await api.put(
        `/student/profile/update/${editStudentForm._id}`,
        editStudentForm,
      );
      if (response.data.success) {
        setMessage("Student updated successfully");
        setShowStudentEditModal(false);
        fetchAllStudents();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error updating student: " + error.message);
    }
  };

  // Update teacher
  const handleUpdateTeacher = async () => {
    try {
      const response = await api.put(
        `/teacher/profile/${editTeacherForm._id}`,
        editTeacherForm,
      );
      if (response.data.success) {
        setMessage("Teacher updated successfully");
        setShowTeacherEditModal(false);
        fetchAllTeachers();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error updating teacher: " + error.message);
    }
  };

  // Approve payment
  const handleApprovePayment = async (studentId, paymentId) => {
    try {
      const response = await api.put(`/student/approve/payment`, {
        studentId,
        paymentId,
      });
      if (response.data.success) {
        setMessage("Payment approved successfully");
        fetchPendingPayments();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error approving payment: " + error.message);
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
        setMessage("Payment rejected");
        fetchPendingPayments();
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error rejecting payment: " + error.message);
    }
  };

  // all receive payment
  const receivedPayment = async () => {
    try {
      const receive = await api.get(`/payment/received`);
      if (receive.data.success) {
        // Handle the received payments data
        setMessage("All Received payments");
        setReceivedPayments(receive.data.data);
        console.log("Received payments:", receive.data.data);
      } else {
        setMessage("Failed to fetch received payments");
      }
    } catch (err) {
      setMessage("Error fetching received payments: " + err.message);
    }
  };

  const rejectPayment = async () => {
    try {
      const reject = await api.get(`/payment/rejected`);
      if (reject.data.success) {
        // Handle the pending payments data
        setMessage("All Reject payments");
        setRejectPaymentStudents(reject.data.data);
        console.log("Rejected payments:", reject.data.data);
      } else {
        setMessage("Failed to fetch rejected payments");
      }
    } catch (err) {
      setMessage("Error fetching rejected payments: " + err.message);
    }
  };
  const pendingPayment = async () => {
    try {
      const pending = await api.get(`/payment/pending`);
      if (pending.data.success) {
        // Handle the pending payments data
        setMessage("All Pending payments");
        setPendingPaymentStudent(pending.data.pending);
        console.log("Pending payments:", pending.data);
      } else {
        setMessage("Failed to fetch pending payments");
      }
    } catch (err) {
      setMessage("Error fetching pending payments: " + err.message);
    }
  };

  let [totalPaid, setTotalPaid] = useState(0);
  let [totalPending, setTotalPending] = useState(0);
  const totalPaidPayment = async () => {
    try {
      const totalPaidResponse = await api.get(`/payment/totalpaid`);
      if (totalPaidResponse.data.success) {
        setTotalPaid(totalPaidResponse.data.totalPaid);
      } else {
        setMessage("Failed to fetch total paid payments");
      }
    } catch (err) {
      setMessage("Error fetching total paid payments: " + err.message);
    }
  };

  const totalPendingPayment = async () => {
    try {
      const totalPending = await api.get(`/payment/totalpending`);
      if (totalPending.data.success) {
        setTotalPending(totalPending.data.totalPending);
      } else {
        setMessage("Failed to pending payment");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <div className="adminDashboard h-full w-full flex flex-col">
        <div className="h-[100%] flex w-full items-center justify-center">
          <div className="AdminPannel bg-gray-600 pt-4 w-[300px] text-white h-[100%] shadow-lg rounded-r-lg">
            <p className="font-bold text-xl opacity-75 p-2 text-grey-400 ">
              Admin
            </p>
            <ul className="flex flex-col gap-2">
              <li
                className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "home" && "bg-blue-300"}`}
                onClick={() => setActivePage("home")}
              >
                {" "}
                <FaHome /> Home
              </li>
              <li>
                <div
                  className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "student" && "bg-blue-300"}`}
                  onClick={() => {
                    setActivePage("student");
                    setSubActivePage("all Student");
                  }}
                >
                  {" "}
                  <PiStudent /> Student
                </div>
                {activePage === "student" && (
                  <ul className="pl-6 mt-2 flex flex-col gap-2 text-sm">
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "all Student" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("all Student")}
                    >
                      {" "}
                      Student Record
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "add Student" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("add Student")}
                    >
                      {" "}
                      Add Student
                    </li>
                   
                
                  </ul>
                )}
              </li>

              {/* Teacher Option */}
              <li>
                <div
                  className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "teacher" && "bg-blue-300"}`}
                  onClick={() => {
                    setActivePage("teacher");
                    setSubActivePage("all Teacher");
                  }}
                >
                  {" "}
                  <FaUserGraduate /> Teacher
                </div>

                {activePage === "teacher" && (
                  <ul className="pl-6 mt-2 flex flex-col gap-2 text-sm">
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "all Teacher" && "text-yellow-400"}`}
                      onClick={() => setSubActivePage("all Teacher")}
                    >
                      {" "}
                      All Teachers
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "add Teacher" && "text-yellow-400"}`}
                      onClick={() => setSubActivePage("add Teacher")}
                    >
                      {" "}
                      Add Teacher
                    </li>
                  
                  </ul>
                )}
              </li>
              {/* Payment Option */}
              <li>
                <div
                  className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "payment" && "bg-blue-300"}`}
                  onClick={() => {
                    setActivePage("payment");
                    setSubActivePage("Dashboard");
                  }}
                >
                  {" "}
                  <FaMoneyBillWave /> Payment
                </div>
                {activePage === "payment" && (
                  <ul className="pl-6 mt-2 flex flex-col gap-2 text-sm">
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "Dashboard" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("Dashboard")}
                    >
                      {" "}
                      Dashboard
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "Pay Fees" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("Pay Fees")}
                    >
                      {" "}
                      Pay Fees
                    </li>

                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "received Payments" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("received Payments")}
                    >
                      {" "}
                      Payment History
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "pending payments" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("pending payments")}
                    >
                      {" "}
                      Pending Payments
                    </li>
                   
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "pending requests" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("pending requests")}
                    >
                      {" "}
                      Pending Payments Request
                    </li>
                  </ul>
                )}
              </li>
              {/* Expense option */}
              <li>
                <div
                  className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "expenses" && "bg-blue-300"}`}
                  onClick={() => {
                    setActivePage("expenses");
    
                  }}
                >
                  {" "}
                  <FaMoneyBillWave /> Expenses{" "}
                </div>

                
              </li>

              <li
                className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "subjects" && "bg-blue-300"}`}
                onClick={() => setActivePage("subjects")}
              >
                {" "}
                <FaBook /> Subjects
              </li>
              <li
                className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "notice" && "bg-blue-300"}`}
                onClick={() => setActivePage("notice")}
              >
                {" "}
                <FaBell /> Notice
              </li>
              <li
                className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "message" && "bg-blue-300"}`}
                onClick={() => setActivePage("message")}
              >
                {" "}
                <FaBell /> Send Message
              </li>

              <li
                className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg font-bold text-red-400`}
                onClick={() => navigate("/")}
              >
                {" "}
                <CiLogout /> Logout
              </li>
            </ul>
          </div>

          <div className="flex-1 flex flex-col transition-all duration-300 w-full h-[100%]">
            {/* Message Alert */}

            {/* ================= Right Side Content ================= */}
            <div
              className={`flex-1 flex flex-col transition-all duration-300 w-full overflow-scroll`}
            >
              {/* Message Alert */}
              {/* {message && (
                <div className="bg-blue-500 text-white p-3 text-center sticky top-0 z-10">
                  {message}
                </div>
              )} */}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-2  w-full">
                {activePage === "home" && (
                  <div className="h-full w-full flex flex-col gap-4">
                    <div className="bg-white rounded shadow">
                      <FinanceGraph />
                    </div>
                       <div className="bg-white rounded shadow">
                      < Dashboard/>
                    </div>
                    <div className="bg-white rounded shadow">
                      <Expense />
                    </div>
                    
                  </div>
                )}

                {/* ========== STUDENT PAGES ========== */}
                {activePage === "student" &&
                  subActivePage === "all Student" && (
                    
                    <StudentDash/>
                    
                  )}

                {activePage === "student" &&
                  subActivePage === "add Student" && (
                    <div className="w-full">
                      <StudentRegister
                        onSuccess={() => {
                          setActivePage("all Student");
                          fetchAllStudents();
                        }}
                      />
                    </div>
                  )}

               

                {/* ========== TEACHER PAGES ========== */}
                {activePage === "teacher" &&
                  subActivePage === "all Teacher" && (
                    <TeacherDash/>
                  )}
{/* add teacher */}
                {activePage === "teacher" &&
                  subActivePage === "add Teacher" && (
                    <div className="w-full">
                      <TeacherRegister
                        onSuccess={() => {
                          setActivePage("all Teacher");
                          fetchAllTeachers();
                        }}
                      />
                    </div>
                  )}
 

                {/* ========== PAYMENT MANAGEMENT ========== */}
                {activePage === "payment" && subActivePage === "Dashboard" && (
                  <div className="bg-white p-4 rounded-lg shadow-md w-full">
                    {loading ? <p>Loading payments...</p> : <Dashboard />}
                  </div>
                )}

                {activePage === "payment" &&
                  subActivePage === "pending requests" && (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <PendingRequest />
                    </div>
                  )}

                {activePage === "payment" &&
                  subActivePage === "received Payments" && (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <History />
                    </div>
                  )}

                {activePage === "payment" &&
                  subActivePage === "pending payments" && <PendingPayment />}

                {activePage === "payment" && subActivePage === "Pay Fees" && (
                  <All_Payment />
                )}

              

                {activePage === "subjects" && <SubjectManagement />}

                {activePage === "expenses" && (
                  <div className="ml-[250px] gap-4 flex flex-col  ">
                    <Expense />
                      <All/>
                  </div>
                )}

         

                {activePage === "notice" && <NoticeManagement />}
                {activePage === "message" && <SendMessage />}
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDash;
