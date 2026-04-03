import React, { useContext, useEffect, useMemo, useState } from "react";

import {
  FaBars,
  FaChevronLeft,
  FaHome,
  FaMoneyBillWave,
  FaBook,
  FaBell,
  FaUserGraduate,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { FaRegMessage } from "react-icons/fa6";
import api from "../src/api/axios";
import StudentRegister from "../src/Student/StudentRegister";
import SubjectManagement from "./SubjectManagement";
import TeacherRegister from "../src/Teacher/TeacherRegister";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { clearAuthToken } from "../src/utils/auth.js";
import StaffSettings from "../src/Settings/StaffSettings.jsx";
import AdminProfilePanel from "../src/components/admin/AdminProfilePanel.jsx";
import AppContext from "../src/Context/AppContext.jsx";

// using configured api instance from src/api/axios

const AdminDash = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();
  const queryId = useMemo(
    () => new URLSearchParams(location.search).get("id"),
    [location.search],
  );
  const adminId = paramId || queryId;

  const { tutionFees, totalDiscount } = useContext(AppContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [activePage, setActivePage] = useState("home");
  const [subActivePage, setSubActivePage] = useState("");
  const [adminProfile, setAdminProfile] = useState(null);

  // Student management states

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [staffRefreshKey, setStaffRefreshKey] = useState(0);
  const [totalFees, setTotalFees] = useState(0);

  const fetchAdminSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/admin-summary");
      if (res.data.success) {
        setTotalFees(res.data?.totalFeesAfterDiscount);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to Load Summary");
    }
  };

  // authentication
  useEffect(() => {
    if (!adminId) {
      setLoading(false);
      setError("Not A vaild Authentication Please Login first");
      return;
    }
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const admin = await api.get(`/user/profile/${adminId}`);

        if (!admin.data?.success)
          setError(admin.data?.message || "Failed to Load Profile");
        else setAdminProfile(admin.data.admin || null);
      } catch (error) {
        setError(
          error.response?.data?.message || "Error fetching dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
    fetchAdminSummary();
  }, [adminId]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activePage, subActivePage]);

  const pageTitle = useMemo(() => {
    if (activePage === "home") return "Dashboard";
    if (activePage === "profile") return "My Profile";
    if (activePage === "student")
      return subActivePage ? `Students • ${subActivePage}` : "Students";
    if (activePage === "teacher")
      return subActivePage ? `Teachers • ${subActivePage}` : "Teachers";
    if (activePage === "payment")
      return subActivePage ? `Payments • ${subActivePage}` : "Payments";
    if (activePage === "expenses") return "Expenses";
    if (activePage === "subjects") return "Subjects";
    if (activePage === "notice") return "Notice";
    if (activePage === "message") return "Message";
    if (activePage === "settings")
      return subActivePage ? `Settings • ${subActivePage}` : "Settings";
    return "Admin";
  }, [activePage, subActivePage]);

  const handleNav = (page, subPage) => {
    setActivePage(page);
    if (subPage !== undefined) setSubActivePage(subPage);
    setMobileNavOpen(false);
  };

  const NavItem = ({
    active,
    icon,
    label,
    onClick,
    right,
    showLabel = sidebarOpen,
  }) => {
    const IconComponent = icon;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          active
            ? "bg-slate-800 text-white"
            : "text-slate-200 hover:bg-slate-800/70 hover:text-white"
        }`}
      >
        <span className="shrink-0">
          <IconComponent />
        </span>
        {showLabel && <span className="flex-1 text-left">{label}</span>}
        {showLabel && right}
      </button>
    );
  };

  const SubItem = ({ active, label, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
        active
          ? "bg-slate-800/60 text-white"
          : "text-slate-300 hover:bg-slate-800/40 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  const Card = ({ children, className = "" }) => (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium backdrop-blur">
            Loading Admin dashboard...
          </div>
        </div>
      </div>
    );
  }

  // all receive payment
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
            Admin Portal
          </p>
          <h1 className="mt-3 text-3xl font-black">Unable to load dashboard</h1>
          <p className="mt-3 text-slate-300">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
          {/* notice131 */}
          <aside className="absolute left-0 top-0 h-full w-72 bg-slate-900 text-slate-100 border-r border-slate-800 p-3">
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-800 grid place-items-center font-bold">
                  {adminProfile?.imgSrc ? (
                    <img
                      src={adminProfile?.imgSrc}
                      alt="Admin Profile"
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                  ) : (
                    "A"
                  )}
                </div>
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
              <NavItem
                showLabel
                active={activePage === "home"}
                icon={FaHome}
                label="Home"
                onClick={() => handleNav("home")}
              />
              <NavItem
                showLabel
                active={activePage === "profile"}
                icon={FaUserCircle}
                label="My Profile"
                onClick={() => handleNav("profile")}
              />

              <NavItem
                showLabel
                active={activePage === "student"}
                icon={PiStudent}
                label="Students"
                onClick={() => handleNav("student", "all Student")}
              />
              {activePage === "student" && (
                <div className="ml-8 space-y-1">
                  <SubItem
                    active={subActivePage === "all Student"}
                    label="Student Record"
                    onClick={() => handleNav("student", "all Student")}
                  />
                  <SubItem
                    active={subActivePage === "add Student"}
                    label="Add Student"
                    onClick={() => handleNav("student", "add Student")}
                  />
                </div>
              )}
              {/* teacher */}
              <NavItem
                showLabel
                active={activePage === "teacher"}
                icon={FaUserGraduate}
                label="Teachers"
                onClick={() => handleNav("teacher", "all Teacher")}
              />

              {activePage === "teacher" && (
                <div className="ml-8 space-y-1">
                  <SubItem
                    active={subActivePage === "all Teacher"}
                    label="Teacher Record"
                    onClick={() => handleNav("teacher", "all Teacher")}
                  />
                  <SubItem
                    active={subActivePage === "add Teacher"}
                    label="Add Teacher"
                    onClick={() => handleNav("teacher", "add Teacher")}
                  />
                </div>
              )}
              {/* teacher */}
              {/* Payment */}
              <NavItem
                showLabel
                active={activePage === "payment"}
                icon={FaMoneyBillWave}
                label="Payments"
                onClick={() => handleNav("payment", "Dashboard")}
              />
              {activePage === "payment" && (
                <div className="ml-8 space-y-1">
                  <SubItem
                    active={subActivePage === "Dashboard"}
                    label="Dashboard"
                    onClick={() => handleNav("payment", "Dashboard")}
                  />
                  <SubItem
                    active={subActivePage === "Pay Fees"}
                    label="Pay Fees"
                    onClick={() => handleNav("payment", "Pay Fees")}
                  />
                  <SubItem
                    active={subActivePage === "received Payments"}
                    label="Payment History"
                    onClick={() => handleNav("payment", "received Payments")}
                  />
                  <SubItem
                    active={subActivePage === "pending payments"}
                    label="Pending Payments"
                    onClick={() => handleNav("payment", "pending payments")}
                  />
                  <SubItem
                    active={subActivePage === "pending requests"}
                    label="Pending Requests"
                    onClick={() => handleNav("payment", "pending requests")}
                  />
                </div>
              )}

              <NavItem
                showLabel
                active={activePage === "expenses"}
                icon={FaMoneyBillWave}
                label="Expenses"
                onClick={() => handleNav("expenses")}
              />
              <NavItem
                showLabel
                active={activePage === "subjects"}
                icon={FaBook}
                label="Subjects"
                onClick={() => handleNav("subjects")}
              />
              <NavItem
                showLabel
                active={activePage === "notice"}
                icon={FaBell}
                label="Notice"
                onClick={() => {
                  handleNav("notice");
                }}
              />
              <NavItem
                showLabel
                active={activePage === "message"}
                icon={FaRegMessage}
                label="Message"
                onClick={() => handleNav("message")}
              />
              <NavItem
                showLabel
                active={activePage === "settings"}
                icon={FaCog}
                label="Settings"
                onClick={() => handleNav("settings", "staff access")}
              />
              {activePage === "settings" && (
                <div className="ml-8 space-y-1">
                  <SubItem
                    active={subActivePage === "staff access"}
                    label="Staff Access"
                    onClick={() => handleNav("settings", "staff access")}
                  />
                </div>
              )}

              <div className="pt-2 mt-2 border-t border-slate-800">
                <NavItem
                  showLabel
                  active={false}
                  icon={CiLogout}
                  label="Logout"
                  onClick={() => {
                    (navigate("/"), clearAuthToken());
                  }}
                />
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
              <div className="h-9 w-9 rounded-lg bg-slate-800 grid place-items-center font-bold">
                {adminProfile?.imgSrc ? (
                  <img
                    src={adminProfile?.imgSrc}
                    alt="Admin Profile"
                    className="h-9 w-9 rounded-lg object-cover"
                  />
                ) : (
                  "A"
                )}
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="font-semibold leading-5 truncate">
                    Admin Panel
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    ERP Dashboard
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-lg hover:bg-slate-800"
              aria-label="Toggle sidebar"
            >
              <FaChevronLeft
                className={`${sidebarOpen ? "" : "rotate-180"} transition`}
              />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <NavItem
              active={activePage === "home"}
              icon={FaHome}
              label="Home"
              onClick={() => handleNav("home")}
            />
            <NavItem
              active={activePage === "profile"}
              icon={FaUserCircle}
              label="My Profile"
              onClick={() => handleNav("profile")}
            />

            <NavItem
              active={activePage === "student"}
              icon={PiStudent}
              label="Students"
              onClick={() => handleNav("student", "all Student")}
            />
            {sidebarOpen && activePage === "student" && (
              <div className="ml-8 space-y-1">
                <SubItem
                  active={subActivePage === "all Student"}
                  label="Student Record"
                  onClick={() => handleNav("student", "all Student")}
                />
                <SubItem
                  active={subActivePage === "add Student"}
                  label="Add Student"
                  onClick={() => handleNav("student", "add Student")}
                />
              </div>
            )}

            <NavItem
              active={activePage === "teacher"}
              icon={FaUserGraduate}
              label="Teachers"
              onClick={() => handleNav("teacher", "all Teacher")}
            />
            {sidebarOpen && activePage === "teacher" && (
              <div className="ml-8 space-y-1">
                <SubItem
                  active={subActivePage === "all Teacher"}
                  label="Teacher Record"
                  onClick={() => handleNav("teacher", "all Teacher")}
                />
                <SubItem
                  active={subActivePage === "add Teacher"}
                  label="Add Teacher"
                  onClick={() => handleNav("teacher", "add Teacher")}
                />
              </div>
            )}

            <NavItem
              active={activePage === "payment"}
              icon={FaMoneyBillWave}
              label="Payments"
              onClick={() => handleNav("payment", "Dashboard")}
            />
            {sidebarOpen && activePage === "payment" && (
              <div className="ml-8 space-y-1">
                <SubItem
                  active={subActivePage === "Dashboard"}
                  label="Dashboard"
                  onClick={() => handleNav("payment", "Dashboard")}
                />
                <SubItem
                  active={subActivePage === "Pay Fees"}
                  label="Pay Fees"
                  onClick={() => handleNav("payment", "Pay Fees")}
                />
                <SubItem
                  active={subActivePage === "received Payments"}
                  label="Payment History"
                  onClick={() => handleNav("payment", "received Payments")}
                />
                <SubItem
                  active={subActivePage === "pending payments"}
                  label="Pending Payments"
                  onClick={() => handleNav("payment", "pending payments")}
                />
                <SubItem
                  active={subActivePage === "pending requests"}
                  label="Pending Requests"
                  onClick={() => handleNav("payment", "pending requests")}
                />
              </div>
            )}

            <NavItem
              active={activePage === "expenses"}
              icon={FaMoneyBillWave}
              label="Expenses"
              onClick={() => handleNav("expenses")}
            />
            <NavItem
              active={activePage === "subjects"}
              icon={FaBook}
              label="Subjects"
              onClick={() => handleNav("subjects")}
            />
            <NavItem
              active={activePage === "notice"}
              icon={FaBell}
              label="Notice"
              onClick={() => {
                handleNav("notice");
              }}
            />
            <NavItem
              active={activePage === "message"}
              icon={FaRegMessage}
              label="Message"
              onClick={() => handleNav("message")}
            />
            <NavItem
              active={activePage === "settings"}
              icon={FaCog}
              label="Settings"
              onClick={() => handleNav("settings", "staff access")}
            />
            {sidebarOpen && activePage === "settings" && (
              <div className="ml-8 space-y-1">
                <SubItem
                  active={subActivePage === "staff access"}
                  label="Staff Access"
                  onClick={() => handleNav("settings", "staff access")}
                />
              </div>
            )}
          </nav>

          <div className="p-3 border-t border-slate-800">
            <NavItem
              active={false}
              icon={CiLogout}
              label="Logout"
              onClick={() => {
                (navigate("/"), clearAuthToken());
              }}
            />
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
                <h1 className="text-lg font-semibold text-slate-900 truncate">
                  {pageTitle}
                </h1>
                <p className="text-xs text-slate-500 truncate">
                  Manage students, teachers, payments and notices
                </p>
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
                onClick={() => {
                  (navigate("/"), clearAuthToken());
                }}
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
                  <button
                    type="button"
                    onClick={() => setMessage("")}
                    className="text-blue-900/70 hover:text-blue-900"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {activePage === "home" && (
                <div className="flex flex-col gap-4">
                  <Card className="xl:col-span-2 p-3">
                    <FinanceGraph totalFees={totalFees} />
                  </Card>
                  <Card className="p-3">
                    <Dashboard />
                  </Card>
                  <Card className="p-3">
                    <Expense />
                  </Card>
                </div>
              )}

              {activePage === "profile" && (
                <Card className="p-3">
                  <AdminProfilePanel
                    admin={adminProfile}
                    onSaved={(updatedAdmin) => setAdminProfile(updatedAdmin)}
                  />
                </Card>
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
                      setStaffRefreshKey((value) => value + 1);
                    }}
                  />
                </Card>
              )}

              {activePage === "payment" && subActivePage === "Dashboard" && (
                <Card className="p-3">
                  {loading ? (
                    <p className="text-sm text-slate-600">
                      Loading payments...
                    </p>
                  ) : (
                    <Dashboard />
                  )}
                </Card>
              )}

              {activePage === "payment" &&
                subActivePage === "pending requests" && (
                  <Card className="p-3">
                    <PendingRequest />
                  </Card>
                )}

              {activePage === "payment" &&
                subActivePage === "received Payments" && (
                  <Card className="p-3">
                    <History />
                  </Card>
                )}

              {activePage === "payment" &&
                subActivePage === "pending payments" && (
                  <Card className="p-3">
                    <PendingPayment />
                  </Card>
                )}

              {activePage === "payment" && subActivePage === "Pay Fees" && (
                <Card className="p-3">
                  <All_Payment notshow={true} />
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

              {activePage === "settings" &&
                subActivePage === "staff access" && (
                  <Card className="p-3">
                    <StaffSettings refreshKey={staffRefreshKey} />
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
