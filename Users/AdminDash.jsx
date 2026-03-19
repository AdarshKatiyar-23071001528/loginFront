import React, { useEffect, useMemo, useState } from "react";

import {
  FaBars,
  FaChevronLeft,
  FaHome,
  FaMoneyBillWave,
  FaBook,
  FaBell,
  FaUserGraduate,
} from "react-icons/fa";
import { PiStudent } from "react-icons/pi";

import api from "../src/api/axios";
import StudentRegister from "../src/Student/StudentRegister";
import SubjectManagement from "./SubjectManagement";
import TeacherRegister from "../src/Teacher/TeacherRegister";
import { useNavigate } from "react-router-dom";
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
import StudentDash from "../src/StudentForAdmin/StudentDash";
import TeacherDash from "../src/TeacherForAdmin/TeacherDash";


// using configured api instance from src/api/axios

const AdminDash = () => {
  let navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activePage, subActivePage]);

  const pageTitle = useMemo(() => {
    if (activePage === "home") return "Dashboard";
    if (activePage === "student") return subActivePage ? `Students • ${subActivePage}` : "Students";
    if (activePage === "teacher") return subActivePage ? `Teachers • ${subActivePage}` : "Teachers";
    if (activePage === "payment") return subActivePage ? `Payments • ${subActivePage}` : "Payments";
    if (activePage === "expenses") return "Expenses";
    if (activePage === "subjects") return "Subjects";
    if (activePage === "notice") return "Notice";
    if (activePage === "message") return "Message";
    return "Admin";
  }, [activePage, subActivePage]);

  const handleNav = (page, subPage) => {
    setActivePage(page);
    if (subPage !== undefined) setSubActivePage(subPage);
    setMobileNavOpen(false);
  };

  const NavItem = ({ active, icon: Icon, label, onClick, right, showLabel = sidebarOpen }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800/70 hover:text-white"
      }`}
    >
      <span className="shrink-0">
        <Icon />
      </span>
      {showLabel && <span className="flex-1 text-left">{label}</span>}
      {showLabel && right}
    </button>
  );

  const SubItem = ({ active, label, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
        active ? "bg-slate-800/60 text-white" : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
  );

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
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation"
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-slate-900 text-slate-100 border-r border-slate-800 p-3">
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-800 grid place-items-center font-bold">A</div>
                <div>
                  <div className="font-semibold leading-5">Admin Panel</div>
                  <div className="text-xs text-slate-400">ERP Dashboard</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800"
                aria-label="Close"
              >
                <FaChevronLeft />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <NavItem showLabel active={activePage === "home"} icon={FaHome} label="Home" onClick={() => handleNav("home")} />

              <NavItem
                showLabel
                active={activePage === "student"}
                icon={PiStudent}
                label="Students"
                onClick={() => handleNav("student", "all Student")}
                right={
                  studentInCollege ? (
                    <span className="text-xs rounded-full bg-slate-700 px-2 py-0.5">{studentInCollege}</span>
                  ) : null
                }
              />
              {activePage === "student" && (
                <div className="ml-8 space-y-1">
                  <SubItem active={subActivePage === "all Student"} label="Student Record" onClick={() => handleNav("student", "all Student")} />
                  <SubItem active={subActivePage === "add Student"} label="Add Student" onClick={() => handleNav("student", "add Student")} />
                </div>
              )}

              <NavItem
                showLabel
                active={activePage === "teacher"}
                icon={FaUserGraduate}
                label="Teachers"
                onClick={() => handleNav("teacher", "all Teacher")}
                right={
                  totalTeacherInCollege ? (
                    <span className="text-xs rounded-full bg-slate-700 px-2 py-0.5">{totalTeacherInCollege}</span>
                  ) : null
                }
              />
              {activePage === "teacher" && (
                <div className="ml-8 space-y-1">
                  <SubItem active={subActivePage === "all Teacher"} label="Teacher Record" onClick={() => handleNav("teacher", "all Teacher")} />
                  <SubItem active={subActivePage === "add Teacher"} label="Add Teacher" onClick={() => handleNav("teacher", "add Teacher")} />
                </div>
              )}

              <NavItem showLabel active={activePage === "payment"} icon={FaMoneyBillWave} label="Payments" onClick={() => handleNav("payment", "Dashboard")} />
              {activePage === "payment" && (
                <div className="ml-8 space-y-1">
                  <SubItem active={subActivePage === "Dashboard"} label="Dashboard" onClick={() => handleNav("payment", "Dashboard")} />
                  <SubItem active={subActivePage === "Pay Fees"} label="Pay Fees" onClick={() => handleNav("payment", "Pay Fees")} />
                  <SubItem active={subActivePage === "received Payments"} label="Payment History" onClick={() => handleNav("payment", "received Payments")} />
                  <SubItem active={subActivePage === "pending payments"} label="Pending Payments" onClick={() => handleNav("payment", "pending payments")} />
                  <SubItem active={subActivePage === "pending requests"} label="Pending Requests" onClick={() => handleNav("payment", "pending requests")} />
                </div>
              )}

              <NavItem showLabel active={activePage === "expenses"} icon={FaMoneyBillWave} label="Expenses" onClick={() => handleNav("expenses")} />
              <NavItem showLabel active={activePage === "subjects"} icon={FaBook} label="Subjects" onClick={() => handleNav("subjects")} />
              <NavItem showLabel active={activePage === "notice"} icon={FaBell} label="Notice" onClick={() => handleNav("notice")} />
              <NavItem showLabel active={activePage === "message"} icon={FaBell} label="Message" onClick={() => handleNav("message")} />

              <div className="pt-2 mt-2 border-t border-slate-800">
                <NavItem showLabel active={false} icon={CiLogout} label="Logout" onClick={() => navigate("/")} />
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-200 ${
            sidebarOpen ? "w-72" : "w-20"
          }`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-slate-800 grid place-items-center font-bold">A</div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="font-semibold leading-5 truncate">Admin Panel</div>
                  <div className="text-xs text-slate-400 truncate">ERP Dashboard</div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-lg hover:bg-slate-800"
              aria-label="Toggle sidebar"
            >
              <FaChevronLeft className={`${sidebarOpen ? "" : "rotate-180"} transition`} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <NavItem active={activePage === "home"} icon={FaHome} label="Home" onClick={() => handleNav("home")} />

            <NavItem
              active={activePage === "student"}
              icon={PiStudent}
              label="Students"
              onClick={() => handleNav("student", "all Student")}
              right={
                studentInCollege ? (
                  <span className="text-xs rounded-full bg-slate-700 px-2 py-0.5">{studentInCollege}</span>
                ) : null
              }
            />
            {sidebarOpen && activePage === "student" && (
              <div className="ml-8 space-y-1">
                <SubItem active={subActivePage === "all Student"} label="Student Record" onClick={() => handleNav("student", "all Student")} />
                <SubItem active={subActivePage === "add Student"} label="Add Student" onClick={() => handleNav("student", "add Student")} />
              </div>
            )}

            <NavItem
              active={activePage === "teacher"}
              icon={FaUserGraduate}
              label="Teachers"
              onClick={() => handleNav("teacher", "all Teacher")}
              right={
                totalTeacherInCollege ? (
                  <span className="text-xs rounded-full bg-slate-700 px-2 py-0.5">{totalTeacherInCollege}</span>
                ) : null
              }
            />
            {sidebarOpen && activePage === "teacher" && (
              <div className="ml-8 space-y-1">
                <SubItem active={subActivePage === "all Teacher"} label="Teacher Record" onClick={() => handleNav("teacher", "all Teacher")} />
                <SubItem active={subActivePage === "add Teacher"} label="Add Teacher" onClick={() => handleNav("teacher", "add Teacher")} />
              </div>
            )}

            <NavItem active={activePage === "payment"} icon={FaMoneyBillWave} label="Payments" onClick={() => handleNav("payment", "Dashboard")} />
            {sidebarOpen && activePage === "payment" && (
              <div className="ml-8 space-y-1">
                <SubItem active={subActivePage === "Dashboard"} label="Dashboard" onClick={() => handleNav("payment", "Dashboard")} />
                <SubItem active={subActivePage === "Pay Fees"} label="Pay Fees" onClick={() => handleNav("payment", "Pay Fees")} />
                <SubItem active={subActivePage === "received Payments"} label="Payment History" onClick={() => handleNav("payment", "received Payments")} />
                <SubItem active={subActivePage === "pending payments"} label="Pending Payments" onClick={() => handleNav("payment", "pending payments")} />
                <SubItem active={subActivePage === "pending requests"} label="Pending Requests" onClick={() => handleNav("payment", "pending requests")} />
              </div>
            )}

            <NavItem active={activePage === "expenses"} icon={FaMoneyBillWave} label="Expenses" onClick={() => handleNav("expenses")} />
            <NavItem active={activePage === "subjects"} icon={FaBook} label="Subjects" onClick={() => handleNav("subjects")} />
            <NavItem active={activePage === "notice"} icon={FaBell} label="Notice" onClick={() => handleNav("notice")} />
            <NavItem active={activePage === "message"} icon={FaBell} label="Message" onClick={() => handleNav("message")} />
          </nav>

          <div className="p-3 border-t border-slate-800">
            <NavItem active={false} icon={CiLogout} label="Logout" onClick={() => navigate("/")} />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                aria-label="Open navigation"
              >
                <FaBars />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-slate-900 truncate">{pageTitle}</h1>
                <p className="text-xs text-slate-500 truncate">Manage students, teachers, payments and notices</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav("home")}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
              >
                <FaHome />
                Home
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 text-red-600"
              >
                <CiLogout />
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 p-4">
            <div className="max-w-7xl mx-auto space-y-4">
              {message && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 flex items-start justify-between gap-4">
                  <span className="leading-5">{message}</span>
                  <button type="button" onClick={() => setMessage("")} className="text-blue-900/70 hover:text-blue-900">
                    Dismiss
                  </button>
                </div>
              )}

              {activePage === "home" && (
                <div className="flex flex-col gap-4">
                  <Card className="xl:col-span-2 p-3">
                    <FinanceGraph />
                  </Card>
                  <Card className="p-3">
                    <Dashboard />
                  </Card>
                  <Card className="p-3">
                    <Expense />
                  </Card>
                </div>
              )}

              {activePage === "student" && subActivePage === "all Student" && (
                <Card className="p-3">
                  <StudentDash />
                </Card>
              )}

              {activePage === "student" && subActivePage === "add Student" && (
                <Card className="p-3">
                  <StudentRegister
                    onSuccess={() => {
                      handleNav("student", "all Student");
                      fetchAllStudents();
                    }}
                  />
                </Card>
              )}

              {activePage === "teacher" && subActivePage === "all Teacher" && (
                <Card className="p-3">
                  <TeacherDash />
                </Card>
              )}

              {activePage === "teacher" && subActivePage === "add Teacher" && (
                <Card className="p-3">
                  <TeacherRegister
                    onSuccess={() => {
                      handleNav("teacher", "all Teacher");
                      fetchAllTeachers();
                    }}
                  />
                </Card>
              )}

              {activePage === "payment" && subActivePage === "Dashboard" && (
                <Card className="p-3">
                  {loading ? <p className="text-sm text-slate-600">Loading payments...</p> : <Dashboard />}
                </Card>
              )}

              {activePage === "payment" && subActivePage === "pending requests" && (
                <Card className="p-3">
                  <PendingRequest />
                </Card>
              )}

              {activePage === "payment" && subActivePage === "received Payments" && (
                <Card className="p-3">
                  <History />
                </Card>
              )}

              {activePage === "payment" && subActivePage === "pending payments" && (
                <Card className="p-3">
                  <PendingPayment />
                </Card>
              )}

              {activePage === "payment" && subActivePage === "Pay Fees" && (
                <Card className="p-3">
                  <All_Payment />
                </Card>
              )}

              {activePage === "subjects" && (
                <Card className="p-3">
                  <SubjectManagement />
                </Card>
              )}

              {activePage === "expenses" && (
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-3">
                    <Expense />
                  </Card>
                  <Card className="p-3">
                    <All />
                  </Card>
                </div>
              )}

              {activePage === "notice" && (
                <Card className="p-3">
                  <NoticeManagement />
                </Card>
              )}

              {activePage === "message" && (
                <Card className="p-3">
                  <SendMessage />
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
