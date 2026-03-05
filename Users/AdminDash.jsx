import React, { useState, useContext, useEffect } from "react";
import { IoIosLogOut } from "react-icons/io";
import { IoMdMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
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

// using configured api instance from src/api/axios

const AdminDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectStudent, setSelectStudent] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [subActivePage, setSubActivePage] = useState("");
  const [teacher, setTeacher] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editTeacher, setEditTeacher] = useState(null);

  // Student management states
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 
  const [pendingPaymentStudent, setPendingPaymentStudent] = useState([]);
  const [receivedPayments, setReceivedPayments] = useState([]);

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
      // backend returns an array of student documents that contain pending payments
      const data = response.data;
      if (Array.isArray(data)) {
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
  const receivedPayment = async() =>{
    try{
      const receive = await api.get(`/payment/received`);
      if(receive.data.success) {
        // Handle the received payments data
        setMessage("All Received payments");
        setReceivedPayments(receive.data.data);
        console.log("Received payments:", receive.data.data);

      } else {
        setMessage("Failed to fetch received payments");
      }
    }
    catch(err) {
      setMessage("Error fetching received payments: " + err.message);
    }
  }

  const pendingPayment = async() =>{
    try{
      const pending = await api.get(`/payment/pending`);
      if(pending.data.success) {
        // Handle the pending payments data
        setMessage("All Pending payments");
        setPendingPaymentStudent(pending.data.pending);
        console.log("Pending payments:", pending.data);
      } else {
        setMessage("Failed to fetch pending payments");
      }
    }
    catch(err) {
      setMessage("Error fetching pending payments: " + err.message);
    }
  }


  return (
    <>
      <div className="adminDashboard h-full w-full flex flex-col">
        <div className="h-[100px] py-2 bg-blue-300 w-full flex justify-between items-center px-4">
          <div className="ml-4 text-xl font-semibold ">Admin Dashboard</div>
          <button
            className="flex items-center gap-2 font-bold text-red-600 hover:text-red-800 transition"
            onClick={() => alert("Logging out...")}
          >
            Logout <IoIosLogOut />
          </button>
        </div>

        <div className="h-[100%] flex w-full items-center justify-center">
          <div className="AdminPannel bg-gray-600 pt-4 w-[300px] text-white h-[100%] shadow-lg rounded-r-lg">
            <ul className="flex flex-col gap-4">
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
                      All Students
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "add Student" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("add Student")}
                    >
                      {" "}
                      Add Student
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "update Student" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("update Student")}
                    >
                      {" "}
                      Update Student
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "remove Student" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("remove Student")}
                    >
                      {" "}
                      Remove Student
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <div
                  className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "teacher" && "bg-blue-300"}`}
                  onClick={() => {
                    setActivePage("teacher")
                    setSubActivePage("all Teacher")
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
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "update Teacher" && "text-yellow-400"}`}
                      onClick={() => setSubActivePage("update Teacher")}
                    >
                      {" "}
                      Update Teacher
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "remove Teacher" && "text-yellow-400"}`}
                      onClick={() => setSubActivePage("remove Teacher")}
                    >
                      {" "}
                      Remove Teacher
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <div
                className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "payment" && "bg-blue-300"}`}
               
                onClick={() => {  setActivePage("payment"); setSubActivePage("pending requests")}}
              >
                {" "}
                <FaMoneyBillWave /> Payment      
                </div>
                {activePage === "payment" && (
                  <ul className="pl-6 mt-2 flex flex-col gap-2 text-sm">
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "pending requests" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("pending requests")}
                    >
                      {" "}
                      Pending Payments Request
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "received Payments" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("received Payments")}
                    >
                      {" "}
                      Received Payments
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "pending payments" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("pending payments")}
                    >
                      {" "}
                      Pending Payments
                    </li>
                    <li
                      className={`cursor-pointer hover:text-yellow-400 ${subActivePage === "rejected payments" ? "text-yellow-400" : ""}`}
                      onClick={() => setSubActivePage("rejected payments")}
                    >
                      {" "}
                      Rejected Payments
                    </li>
                    
                    
                  </ul>
                )}
              </li>

              <li
                className={`hover:bg-blue-300 flex text-center items-center gap-2 p-2 rounded-l-lg ${activePage === "expenses" && "bg-blue-300"}`}
                onClick={() => setActivePage("expenses")}
              >
                {" "}
                <FaMoneyBillWave /> Expenses
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
            </ul>
          </div>

          <div className="flex-1 flex flex-col transition-all duration-300 w-full h-[100%]">
            {/* Message Alert */}
          
            {/* ================= Right Side Content ================= */}
            <div
              className={`flex-1 flex flex-col transition-all duration-300 w-full `}
            >
              {/* Message Alert */}
              {message && (
                <div className="bg-blue-500 text-white p-3 text-center sticky top-0 z-10">
                  {message}
                </div>
              )}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4  w-full">
                {activePage === "home" && (
                  <h2 className="text-2xl font-bold">
                    Welcome to Admin Dashboard
                  </h2>
                )}

                {/* ========== STUDENT PAGES ========== */}
                {activePage === "student" &&
                  subActivePage === "all Student" && (
                    <div className="">
                      <h2 className="text-2xl font-bold text-blue-600 mb-4">
                        All Students
                      </h2>
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-blue-600 text-white">
                              <tr>
                                <th className="border p-3">Name</th>
                                <th className="border p-3">Email</th>
                                <th className="border p-3">Roll No</th>
                                <th className="border p-3">Mobile</th>
                                <th className="border p-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {students.map((student) => (
                                <tr
                                  key={student._id}
                                  className="hover:bg-gray-100"
                                >
                                  <td className="border p-3">{student.name}</td>
                                  <td className="border p-3">
                                    {student.email}
                                  </td>
                                  <td className="border p-3">
                                    {student.rollno}
                                  </td>
                                  <td className="border p-3">
                                    {student.mobile1}
                                  </td>
                                  <td className="border p-3">
                                    <button
                                      onClick={() => handleEditStudent(student)}
                                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteStudent(student._id)
                                      }
                                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                      <FaTrash />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
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

                {activePage === "student" &&
                  subActivePage === "update Student" && (
                    <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                      <h2 className="text-2xl font-bold text-blue-600 mb-4">
                        Update Student
                      </h2>
                      {students.length === 0 ? (
                        <p>No students available to update</p>
                      ) : (
                        <div className="space-y-4">
                          {students.map((student) => (
                            <div
                              key={student._id}
                              className="border p-4 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                            >
                              <div>
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-sm text-gray-600">
                                  {student.email}
                                </p>
                              </div>
                              <button
                                onClick={() => handleEditStudent(student)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                              >
                                <FaEdit /> Edit
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                {activePage === "student" &&
                  subActivePage === "remove Student" && (
                    <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                      <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Remove Students
                      </h2>
                      {students.length === 0 ? (
                        <p>No students to remove</p>
                      ) : (
                        <div className="space-y-4">
                          {students.map((student) => (
                            <div
                              key={student._id}
                              className="border p-4 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                            >
                              <div>
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-sm text-gray-600">
                                  {student.email}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Roll No: {student.rollno}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteStudent(student._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                {/* ========== TEACHER PAGES ========== */}
                {activePage === "teacher" &&
                  subActivePage === "all Teacher" && (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                     
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-blue-600 text-white">
                              <tr>
                                <th className="border p-3">Name</th>
                                <th className="border p-3">Email</th>
                                <th className="border p-3">Post</th>
                                <th className="border p-3">Mobile</th>
                                <th className="border p-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {teachers.map((teacher) => (
                                <tr
                                  key={teacher._id}
                                  className="hover:bg-gray-100"
                                >
                                  <td className="border p-3">{teacher.name}</td>
                                  <td className="border p-3">
                                    {teacher.email}
                                  </td>
                                  <td className="border p-3">{teacher.post}</td>
                                  <td className="border p-3">
                                    {teacher.mobile}
                                  </td>
                                  <td className="border p-3">
                                    <button
                                      onClick={() => handleEditTeacher(teacher)}
                                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteTeacher(teacher._id)
                                      }
                                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                      <FaTrash />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

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

                {activePage === "teacher" &&
                  subActivePage === "update Teacher" && (
                    <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                      <h2 className="text-2xl font-bold text-blue-600 mb-4">
                        Update Teacher
                      </h2>
                      {teachers.length === 0 ? (
                        <p>No teachers available to update</p>
                      ) : (
                        <div className="space-y-4">
                          {teachers.map((teacher) => (
                            <div
                              key={teacher._id}
                              className="border p-4 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                            >
                              <div>
                                <p className="font-semibold">{teacher.name}</p>
                                <p className="text-sm text-gray-600">
                                  {teacher.email}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Post: {teacher.post}
                                </p>
                              </div>
                              <button
                                onClick={() => handleEditTeacher(teacher)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                              >
                                <FaEdit /> Edit
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                {activePage === "teacher" &&
                  subActivePage === "remove Teacher" && (
                    <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                      <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Remove Teachers
                      </h2>
                      {teachers.length === 0 ? (
                        <p>No teachers to remove</p>
                      ) : (
                        <div className="space-y-4">
                          {teachers.map((teacher) => (
                            <div
                              key={teacher._id}
                              className="border p-4 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                            >
                              <div>
                                <p className="font-semibold">{teacher.name}</p>
                                <p className="text-sm text-gray-600">
                                  {teacher.email}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Post: {teacher.post}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteTeacher(teacher._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                {/* ========== PAYMENT MANAGEMENT ========== */}
                {activePage === "payment" && subActivePage === "pending requests" && (
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">
                      Payment Management
                    </h2>
                    {loading ? (
                      <p>Loading payments...</p>
                    ) : pendingPayments.length === 0 ? (
                      <p className="text-center text-gray-600">
                        No pending payments
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {pendingPayments.map((payment) => (
                          <div
                            key={payment._id}
                            className="border-2 border-yellow-400 p-4 rounded-lg bg-yellow-50 hover:shadow-lg transition"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Student Name
                                </p>
                                <p className="font-semibold">
                                  {payment.studentName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Amount</p>
                                <p className="font-semibold text-lg">
                                  ₹{payment.amount}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Transaction ID
                                </p>
                                <p className="font-semibold">
                                  {payment.transactionId}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-semibold">
                                  {payment.date
                                    ? new Date(
                                        payment.date,
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                              <button
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
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activePage === "payment" && subActivePage === "received Payments" && (<div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-orange-600">
                    Received Payments
                  </h2>
                  {loading ? (
                    <p>Loading received payments...</p>
                  ) : receivedPayments.length === 0 ? (
                    <p>No received payments found.</p>
                  ) : (
                    <div className="space-y-4">
                      {receivedPayments.map((item,index) => (
                        <div key={item._id} className="border border-gray-300 rounded p-4">
                          <div className="grid grid-cols-3 gap-4">

                            <div>
                              <p className="text-sm text-gray-600">Student Name</p>
                              <p className="font-semibold text-lg">
                                {item.payment.studentName}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Amount</p>
                              <p className="font-semibold text-lg">
                                ₹{item.payment.amount}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Transaction ID
                              </p>
                              <p className="font-semibold">
                                {item.payment.transactionId}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-semibold">
                                {item.payment.date
                                  ? new Date(
                                      payment.date,
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>)}

                  {activePage === "payment" && subActivePage === "pending payments" && (<div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-orange-600">
                    Pending Payments
                  </h2>
                  {loading ? (      
                    <p>Loading pending payments...</p>
                  ) : pendingPaymentStudent.length === 0 ? (
                    <p>No pending payments found.</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingPaymentStudent?.map((item,index) => (
                        <div key={item._id} className="border border-gray-300 rounded p-4">
                          <div className="grid grid-cols-2 gap-4">

                            <div>
                              <p className="text-sm text-gray-600">Student Name</p>
                              <p className="font-semibold text-lg">
                                {item.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Amount</p>
                              <p className="font-semibold text-lg">
                                ₹{item.totalfees - item.paidfees}
                              </p>
                            </div>
                            
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>)}



                {activePage === "subjects" && <SubjectManagement />}

                {activePage === "expenses" && (
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-orange-600">
                      Expense Management
                    </h2>
                    <p className="text-gray-600 mt-4">
                      Expense management module coming soon...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ========== STUDENT EDIT MODAL ========== */}
            {showStudentEditModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Edit Student</h3>
                    <button
                      onClick={() => setShowStudentEditModal(false)}
                      className="text-2xl font-bold cursor-pointer hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editStudentForm.name || ""}
                        onChange={(e) =>
                          setEditStudentForm({
                            ...editStudentForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editStudentForm.email || ""}
                        onChange={(e) =>
                          setEditStudentForm({
                            ...editStudentForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Mobile
                      </label>
                      <input
                        type="text"
                        value={editStudentForm.mobile1 || ""}
                        onChange={(e) =>
                          setEditStudentForm({
                            ...editStudentForm,
                            mobile1: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Roll No
                      </label>
                      <input
                        type="text"
                        value={editStudentForm.rollno || ""}
                        onChange={(e) =>
                          setEditStudentForm({
                            ...editStudentForm,
                            rollno: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={editStudentForm.address || ""}
                        onChange={(e) =>
                          setEditStudentForm({
                            ...editStudentForm,
                            address: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        onClick={() => setShowStudentEditModal(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateStudent}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-semibold"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========== TEACHER EDIT MODAL ========== */}
            {showTeacherEditModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Edit Teacher</h3>
                    <button
                      onClick={() => setShowTeacherEditModal(false)}
                      className="text-2xl font-bold cursor-pointer hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editTeacherForm.name || ""}
                        onChange={(e) =>
                          setEditTeacherForm({
                            ...editTeacherForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editTeacherForm.email || ""}
                        onChange={(e) =>
                          setEditTeacherForm({
                            ...editTeacherForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Mobile
                      </label>
                      <input
                        type="text"
                        value={editTeacherForm.mobile || ""}
                        onChange={(e) =>
                          setEditTeacherForm({
                            ...editTeacherForm,
                            mobile: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Post
                      </label>
                      <input
                        type="text"
                        value={editTeacherForm.post || ""}
                        onChange={(e) =>
                          setEditTeacherForm({
                            ...editTeacherForm,
                            post: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Salary
                      </label>
                      <input
                        type="number"
                        value={editTeacherForm.salary || ""}
                        onChange={(e) =>
                          setEditTeacherForm({
                            ...editTeacherForm,
                            salary: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={editTeacherForm.address || ""}
                        onChange={(e) =>
                          setEditTeacherForm({
                            ...editTeacherForm,
                            address: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        onClick={() => setShowTeacherEditModal(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateTeacher}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-semibold"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDash;
