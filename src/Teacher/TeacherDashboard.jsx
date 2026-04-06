import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaBook,
  FaCalendarAlt,
  FaChartLine,
  FaClipboardList,
  FaCog,
  FaHome,
  FaMoneyBillWave,
  FaSave,
  FaUserTie,
  FaWallet,
} from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import api from "../api/axios";
import { clearAuthToken, getAuthUser } from "../utils/auth";
import TeacherProfilePanel from "../components/teacher/TeacherProfilePanel";


const StudentRegister = lazy(() => import("../Student/StudentRegister"));
const SubjectManagement = lazy(() => import("../../Users/SubjectManagement"));
const TeacherRegister = lazy(() => import("./TeacherRegister"));
const Expense = lazy(() => import("../Expenses/Expense"));
const AllExpenses = lazy(() => import("../Expenses/All"));
const PaymentDashboard = lazy(() => import("../../Payment/Dashboard"));
const PendingPayment = lazy(() => import("../../Payment/PendingPayment"));
const AllPayment = lazy(() => import("../../Payment/All_Payment"));
const PaymentHistory = lazy(() => import("../../Payment/History"));
const PendingRequest = lazy(() => import("../../Payment/PendingRequest"));
const SendMessage = lazy(() => import("../../Message/SendMessage"));
const NoticeManagement = lazy(() => import("../../Notice/NoticeManagement"));
const StudentRecord = lazy(() => import("../StudentForAdmin/StudentDash"));
const TeacherRecord = lazy(() => import("../TeacherForAdmin/TeacherDash"));
const StudentNotice = lazy(()=>import("../Student/StudentNotice"));

const permissionLabels = {
  "attendance.manage": "Attendance Management",
  "marks.manage": "Marks Management",
  "students.read": "Student Record",
  "students.manage": "Add Student",
  "teachers.read": "Teacher Record",
  "teachers.manage": "Add Teacher",
  "subjects.read": "Subjects Access",
  "subjects.manage": "Subject",
  "payments.dashboard": "Payment Dashboard",
  "payments.collect": "Pay Fees",
  "payments.history": "Payment History",
  "payments.pending": "Pending Fees",
  "payments.requests": "Pending Request",
  "payments.read": "Payments Read",
  "payments.manage": "Payments Management",
  "expenses.manage": "Expense",
  "notices.manage": "Notice",
  "messages.manage": "Message Management",
  "staff.manage": "Staff Access Control",
};

const subjectTitle = (subject) =>
  [
    subject?.name,
    subject?.course,
    subject?.semester ? `Sem ${subject.semester}` : "",
    subject?.section ? `Sec ${subject.section}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const Panel = ({ title, subtitle, children, scrollable = false }) => (
  <section className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.12)] ">
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
      {subtitle}
    </p>
    <h3 className="mt-1 pb-3 text-2xl font-black">{title}</h3>
    {scrollable ? (
      <div className="  pr-2">
        {children}
      </div>
    ) : (
      children
    )}
  </section>
);

const PanelLoader = ({ label }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
    {label}
  </div>
);
const EmptyBlock = ({ label }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
    {label}
  </div>
);
const InfoLine = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="max-w-[60%] truncate text-sm font-semibold text-slate-900">
      {value}
    </span>
  </div>
);
const StatCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 shadow-lg">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
          {label}
        </p>
        <p className="mt-2 text-3xl font-black text-white">{value}</p>
      </div>
      <span className="rounded-2xl bg-cyan-300 p-3 text-slate-950">
        <Icon />
      </span>
    </div>
  </div>
);

const Field = ({ label, as = "input", children, ...props }) => {
  const Component = as;
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <Component
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
      >
        {children}
      </Component>
    </div>
  );
};

const TeacherDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useMemo(() => getAuthUser(), []);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [subActivePage, setSubActivePage] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({
    subjectId: "",
    date: "",
  });
  const [subjectStudents, setSubjectStudents] = useState([]);
  const [studentStatus, setStudentStatus] = useState({});
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [markForm, setMarkForm] = useState({ subjectId: "", date: "" });
  const [marksStudents, setMarksStudents] = useState([]);
  const [marksByStudent, setMarksByStudent] = useState({});
  const [marksStudentsLoading, setMarksStudentsLoading] = useState(false);
  const [projectForm, setProjectForm] = useState({ subjectId: "", dueDate: "" });
  const [projectStudents, setProjectStudents] = useState([]);
  const [projectsByStudent, setProjectsByStudent] = useState({});
  const [projectStudentsLoading, setProjectStudentsLoading] = useState(false);
  const fetchedIdRef = useRef("");

  const permissions =
    teacher?.permissions ||
    (String(authUser?._id || "") === String(id || "") ? authUser?.permissions || [] : []);
  const can = (...keys) => keys.some((key) => permissions.includes(key));

  const canManageAttendance = can("attendance.manage");
  const canManageMarks = can("marks.manage");
  const canManageProjects = can("marks.manage", "students.read", "students.manage");
  const canStudentRecord = can("students.read");
  const canAddStudent = can("students.manage");
  const canTeacherRecord = can(
    "teachers.read",
    "teachers.manage",
    "staff.manage",
  );
  const canAddTeacher = can("teachers.manage", "staff.manage");
  const canReadSubjects = can("subjects.read", "subjects.manage");
  const canUseAcademicSubjects =
    canManageAttendance || canManageMarks || canReadSubjects;
  const canManageSubjects = can("subjects.manage");
  const canPaymentDashboard = can(
    "payments.dashboard",
    "payments.read",
    "payments.manage",
  );
  const canPayFees = can("payments.collect", "payments.manage");
  const canPaymentHistory = can(
    "payments.history",
    "payments.read",
    "payments.manage",
  );
  const canPendingFees = can(
    "payments.pending",
    "payments.read",
    "payments.manage",
  );
  const canPendingRequest = can(
    "payments.requests",
    "payments.read",
    "payments.manage",
  );
  const canManageExpenses = can("expenses.manage");
  const canManageNotices = can("notices.manage");
  const canManageMessages = can("messages.manage");

  const navSections = useMemo(
    () =>
      [
        { key: "home", label: "Home", icon: FaHome },
        { key: "profile", label: "My Profile", icon: FaUserTie },
        {
          key: "academic",
          label: "Academic",
          icon: FaBook,
          items: [
            canManageAttendance
              ? { key: "attendance", label: "Attendance" }
              : null,
            canManageMarks ? { key: "marks", label: "Marks" } : null,
            canManageProjects ? { key: "project", label: "Project" } : null,
            canUseAcademicSubjects
              ? {
                  key: "subject",
                  label: canManageSubjects ? "Subject" : "Assigned Subjects",
                }
              : null,
          ].filter(Boolean),
        },
        {
          key: "student",
          label: "Students",
          icon: PiStudent,
          items: [
            canStudentRecord
              ? { key: "student record", label: "Student Record" }
              : null,
            canAddStudent ? { key: "add student", label: "Add Student" } : null,
          ].filter(Boolean),
        },
        {
          key: "teacher",
          label: "Staff",
          icon: FaUserTie,
          items: [
            canTeacherRecord
              ? { key: "teacher record", label: "Teacher Record" }
              : null,
            canAddTeacher ? { key: "add teacher", label: "Add Teacher" } : null,
          ].filter(Boolean),
        },
        {
          key:"staff_notice",
          label:"Staff Notice",
          icon:FaBell
        },
        {
          key: "payment",
          label: "Payments",
          icon: FaMoneyBillWave,
          items: [
            canPaymentDashboard
              ? { key: "dashboard", label: "Dashboard" }
              : null,
            canPayFees ? { key: "pay fees", label: "Pay Fees" } : null,
            canPaymentHistory
              ? { key: "payment history", label: "Payment History" }
              : null,
            canPendingFees
              ? { key: "pending fees", label: "Pending Fees" }
              : null,
            canPendingRequest
              ? { key: "pending request", label: "Pending Request" }
              : null,
          ].filter(Boolean),
        },
        canManageExpenses
          ? { key: "expense", label: "Expense", icon: FaWallet }
          : null,
        canManageNotices
          ? { key: "notice", label: "Notice", icon: FaBell }
          : null,
        canManageMessages
          ? { key: "messages", label: "Messages", icon: FaBell }
          : null,
        { key: "logout", label: "Logout", icon: CiLogout },
      ].filter(Boolean),
    [
      canAddStudent,
      canAddTeacher,
      canManageAttendance,
      canManageExpenses,
      canManageMarks,
      canManageProjects,
      canManageMessages,
      canManageNotices,
      canManageSubjects,
      canPaymentDashboard,
      canPayFees,
      canPaymentHistory,
      canPendingFees,
      canPendingRequest,
      canReadSubjects,
      canUseAcademicSubjects,
      canStudentRecord,
      canTeacherRecord,
    ],
  );

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Not a valid staff login. Please sign in again.");
      return;
    }
    if (fetchedIdRef.current === String(id)) return;
    fetchedIdRef.current = String(id);

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const teacherRes = await api.get(`/teacher/profile/${id}`);
        const teacherProfile = teacherRes.data.teacher || null;
        const effectivePermissions =
          teacherProfile?.permissions || authUser?.permissions || [];

        setTeacher(teacherProfile);

        const [attendanceRes, marksRes, subjectsRes] = await Promise.all([
          effectivePermissions.includes("attendance.manage")
            ? api.get(`/attendance/teacher/${id}`)
            : Promise.resolve({ data: { records: [] } }),
          effectivePermissions.includes("marks.manage")
            ? api.get(`/marks/teacher/${id}`)
            : Promise.resolve({ data: { marks: [] } }),
          effectivePermissions.includes("attendance.manage") ||
          effectivePermissions.includes("marks.manage") ||
          effectivePermissions.includes("subjects.read") ||
          effectivePermissions.includes("subjects.manage")
            ? api.get(`/subject/teacher/${id}`)
            : Promise.resolve({ data: { subjects: [] } }),
        ]);

        setAttendance(attendanceRes.data.records || []);
        setMarks(marksRes.data.marks || []);
        setSubjects(subjectsRes.data.subjects || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const section = navSections.find((item) => item.key === activePage);
    if (section) {
      if (
        section.items?.length &&
        !section.items.some((item) => item.key === subActivePage)
      ) {
        setSubActivePage(section.items[0].key);
      }
      if (!section.items?.length && subActivePage) {
        setSubActivePage("");
      }
      return;
    }

    const firstSection =
      navSections.find((item) => item.key !== "logout") || navSections[0];
    if (firstSection) {
      setActivePage(firstSection.key);
      setSubActivePage(firstSection.items?.[0]?.key || "");
    }
  }, [activePage, navSections, subActivePage]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!attendanceForm.subjectId || !canManageAttendance) {
        setSubjectStudents([]);
        setStudentStatus({});
        return;
      }
      setStudentsLoading(true);
      try {
        const res = await api.get(
          `/attendance/students/${attendanceForm.subjectId}`,
        );
        const list = res.data.students || [];
        setSubjectStudents(list);
        setStudentStatus((prev) => {
          const next = { ...prev };
          list.forEach((student) => {
            if (!next[student._id]) next[student._id] = "present";
          });
          return next;
        });
      } catch {
        setSubjectStudents([]);
        setStudentStatus({});
      } finally {
        setStudentsLoading(false);
      }
    };

    loadStudents();
  }, [attendanceForm.subjectId, canManageAttendance]);

  useEffect(() => {
    const loadMarksStudents = async () => {
      if (!markForm.subjectId || !canManageMarks) {
        setMarksStudents([]);
        setMarksByStudent({});
        return;
      }
      setMarksStudentsLoading(true);
      try {
        const res = await api.get(`/attendance/students/${markForm.subjectId}`);
        const list = res.data.students || [];
        setMarksStudents(list);
        setMarksByStudent((prev) => {
          const next = { ...prev };
          list.forEach((student) => {
            if (next[student._id] === undefined) next[student._id] = "";
          });
          return next;
        });
      } catch {
        setMarksStudents([]);
        setMarksByStudent({});
      } finally {
        setMarksStudentsLoading(false);
      }
    };

    loadMarksStudents();
  }, [markForm.subjectId, canManageMarks]);

  useEffect(() => {
    const loadProjectStudents = async () => {
      if (!projectForm.subjectId || !canManageProjects) {
        setProjectStudents([]);
        setProjectsByStudent({});
        return;
      }
      setProjectStudentsLoading(true);
      try {
        const res = await api.get(`/attendance/students/${projectForm.subjectId}`);
        const list = res.data.students || [];
        setProjectStudents(list);
        setProjectsByStudent((prev) => {
          const next = { ...prev };
          list.forEach((student) => {
            if (!next[student._id]) {
              next[student._id] = { title: "", description: "" };
            }
          });
          return next;
        });
      } catch {
        setProjectStudents([]);
        setProjectsByStudent({});
      } finally {
        setProjectStudentsLoading(false);
      }
    };

    loadProjectStudents();
  }, [projectForm.subjectId, canManageProjects]);

  const handleNav = (page, subPage = "") => {
    if (page === "logout") {
      clearAuthToken();
      navigate("/");
      return;
    }
    setActivePage(page);
    setSubActivePage(subPage);
    setMobileNavOpen(false);
  };

  const handleSectionClick = (section) => {
    if (section.key === "logout") {
      handleNav("logout");
      return;
    }

    const nextSubPage = section.items?.[0]?.key || "";
    const isMobileViewport =
      typeof window !== "undefined" && window.innerWidth < 1024;

    setActivePage(section.key);
    setSubActivePage((prev) =>
      section.items?.some((item) => item.key === prev) ? prev : nextSubPage,
    );

    if (!isMobileViewport || !section.items?.length) {
      setMobileNavOpen(false);
    }
  };
  

  const setAllStudentStatus = (status) => {
    const next = {};
    subjectStudents.forEach((student) => {
      next[student._id] = status;
    });
    setStudentStatus(next);
  };

  const handleAttendanceSubmit = async () => {
    if (
      !attendanceForm.subjectId ||
      !attendanceForm.date ||
      !canManageAttendance
    )
      return;
    try {
      const records = subjectStudents.map((student) => ({
        studentId: student._id,
        status: studentStatus[student._id] || "absent",
      }));
      await api.post("/attendance", {
        subjectId: attendanceForm.subjectId,
        teacherId: id,
        date: attendanceForm.date,
        records,
      });
      const refreshed = await api.get(`/attendance/teacher/${id}`);
      setAttendance(refreshed.data.records || []);
      setAttendanceForm((prev) => ({ ...prev, date: "" }));

      if(refreshed.data.success){
        alert("Attendance marked successfully");
      }
    } catch {
      alert("Attendance mark failed");
    }
  };

  const handleMarkSubmit = async () => {
    if (!markForm.subjectId || !canManageMarks) return;
    try {
      const records = marksStudents
        .map((student) => ({
          studentId: student._id,
          marks: marksByStudent[student._id],
        }))
        .filter(
          (item) =>
            item.marks !== "" &&
            item.marks !== undefined &&
            item.marks !== null,
        );

      if (!records.length) {
        alert("Please enter marks for at least one student");
        return;
      }

      await api.post("/marks/bulk", {
        subjectId: markForm.subjectId,
        teacherId: id,
        date: markForm.date || undefined,
        records,
      });
      const refreshed = await api.get(`/marks/teacher/${id}`);
      setMarks(refreshed.data.marks || []);
      setMarkForm((prev) => ({ ...prev, date: "" }));
      setMarksByStudent({});
    } catch {
      alert("Marks entry failed");
    }
  };

  const handleProjectSubmit = async () => {
    if (!projectForm.subjectId || !canManageProjects) return;
    try {
      const selectedSubject = subjects.find(
        (subject) => String(subject._id) === String(projectForm.subjectId),
      );
      const records = projectStudents
        .map((student) => ({
          studentId: student._id,
          title: projectsByStudent[student._id]?.title || "",
          description: projectsByStudent[student._id]?.description || "",
        }))
        .filter((item) => item.title.trim());

      if (!records.length) {
        alert("Please enter project title for at least one student");
        return;
      }

      await api.post("/student/assign-project/bulk", {
        subjectId: projectForm.subjectId,
        subjectName: selectedSubject ? subjectTitle(selectedSubject) : "",
        dueDate: projectForm.dueDate || undefined,
        records,
      });
      setProjectForm((prev) => ({ ...prev, dueDate: "" }));
      setProjectsByStudent({});
      alert("Projects assigned successfully");
    } catch {
      alert("Project assignment failed");
    }
  };

  const stats = [
    { label: "Subjects", value: subjects.length, icon: FaBook },
    { label: "Attendance", value: attendance.length, icon: FaClipboardList },
    { label: "Marks", value: marks.length, icon: FaChartLine },
    {
      label: "Modules",
      value: Math.max(
        navSections.reduce(
          (count, section) => count + (section.items?.length || 1),
          0,
        ) - 1,
        0,
      ),
      icon: FaCog,
    },
  ];

  const teacherName = teacher?.name || "Staff";
  const teacherMeta = [teacher?.role, teacher?.destination, teacher?.email]
    .filter(Boolean)
    .join(" | ");
  const permissionBadges = permissions.map(
    (permission) => permissionLabels[permission] || permission,
  );
  const noFeatureAccess =
    navSections.filter(
      (item) =>
        item.key !== "home" &&
        item.key !== "profile" &&
        item.key !== "logout",
    ).length === 0;
  const pageTitle =
    activePage === "home"
      ? "Dashboard"
      : subActivePage ||
        navSections.find((item) => item.key === activePage)?.label ||
        "Dashboard";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium backdrop-blur">
            Loading teacher dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
            Staff Portal
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
    <div className="min-h-screen bg-[linear-gradient(180deg,_#0f172a_0%,_#111827_45%,_#172554_100%)] text-white">
      <div className="mx-auto flex max-w-[120rem] gap-6 px-4 py-5 sm:px-6 lg:items-start lg:px-8">

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[18.5rem] flex-shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-slate-950/95 p-5 shadow-2xl transition-transform duration-300 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:sticky lg:top-5 lg:h-auto lg:min-h-[calc(100vh-2.5rem)] lg:translate-x-0 lg:self-start lg:rounded-[2rem] lg:border lg:bg-white/10 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">
                ERP Dashboard
              </p>
              <h1 className="mt-2 text-2xl font-black">Staff Portal</h1>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white lg:hidden"
            >
              <FaBars />
            </button>
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4">
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${!teacher.imgSrc ? "bg-cyan-300" : ''} text-3xl font-black text-slate-950`}>

                { teacher.imgSrc ?  <img src={teacher.imgSrc } alt="" className="rounded-xl"/> : teacherName.charAt(0)}
               
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-black text-white">
                  {teacherName}
                </p>
                <p className="mt-1 truncate text-sm text-slate-300">
                  {teacherMeta || "Staff workspace"}
                </p>
              </div>
            </div>
          </div>
          <nav className="mt-6 space-y-3 pb-6">
            {navSections.map((section) => {
              const Icon = section.icon;
              const isActive = activePage === section.key;
              return (
                <div key={section.key} className="space-y-2">
                  <button
                    onClick={() => handleSectionClick(section)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${isActive ? "border-cyan-300/50 bg-cyan-400/15 text-white" : section.key === "logout" ? "border-white/10 bg-white/5 text-rose-300 hover:bg-white/10" : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"}`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white"}`}
                    >
                      <Icon />
                    </span>
                    <span className="font-semibold">{section.label}</span>
                  </button>
                  {isActive && section.items?.length ? (
                    <div className="ml-4 space-y-2 border-l border-white/10 pl-4">
                      {section.items.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => handleNav(section.key, item.key)}
                          className={`block w-full rounded-2xl px-4 py-2 text-left text-sm transition ${subActivePage === item.key ? "bg-white text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </aside>

        {mobileNavOpen ? (
          <button
            className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        ) : null}

        
        <main className="min-w-0 flex-1">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 shadow-[0_24px_80px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="inline-flex rounded-2xl border border-white/10 bg-white/10 p-3 text-white lg:hidden"
                >
                  <FaBars />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                    Staff Dashboard
                  </p>
                  <h2 className="mt-1 text-2xl font-black">{pageTitle}</h2>
                </div>
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-white">
                  {teacherName}
                </div>
                <div className="text-xs text-slate-300">
                  {teacherMeta || "Assigned access only"}
                </div>
              </div>
            </div>
            <div className="space-y-6 px-5 py-6 sm:px-8">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <StatCard key={item.label} {...item} />
                ))}
              </div>
              {noFeatureAccess ? (
                <Panel
                  title="Access Required"
                  subtitle="No staff authority assigned"
                >
                  <EmptyBlock label="No Authority Provide By Admin" />
                </Panel>
              ) : null}
              {activePage === "home" ? (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                  <Panel
                    title="Workspace Overview"
                    subtitle="Available modules"
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      {navSections
                        .filter(
                          (section) =>
                            section.key !== "home" &&
                            section.key !== "profile" &&
                            section.key !== "logout",
                        )
                        .map((section) => (
                          <div
                            key={section.key}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="text-sm font-bold text-slate-900">
                              {section.label}
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                              {section.items?.length
                                ? section.items
                                    .map((item) => item.label)
                                    .join(", ")
                                : "Direct access enabled"}
                            </div>
                          </div>
                        ))}
                    </div>
                  </Panel>
                  <div className="space-y-6">
                    <Panel title="Profile" subtitle="Staff snapshot">
                      <div className="space-y-3">
                        <InfoLine label="Name" value={teacherName} />
                        <InfoLine label="Role" value={teacher?.role || "-"} />
                        <InfoLine label="Email" value={teacher?.email || "-"} />
                        <InfoLine
                          label="Mobile"
                          value={teacher?.mobile || "-"}
                        />
                        <InfoLine
                          label="Joining"
                          value={formatDate(teacher?.joiningDate)}
                        />
                      </div>
                    </Panel>
                    <Panel title="Authority" subtitle="Assigned permissions">
                      <div className="flex flex-wrap gap-2">
                        {permissionBadges.length ? (
                          permissionBadges.map((badge) => (
                            <span
                              key={badge}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                            >
                              {badge}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">
                            No authority assigned.
                          </span>
                        )}
                      </div>
                    </Panel>
                  </div>
                </div>
              ) : null}
              {activePage === "profile" ? (
                <TeacherProfilePanel
                  teacher={teacher}
                  onTeacherUpdated={(updatedTeacher) => setTeacher(updatedTeacher)}
                />
              ) : null}
              {activePage === "academic" &&
              subActivePage === "attendance" &&
              canManageAttendance ? (
                <Panel title="Attendance" subtitle="Daily attendance workspace">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="Subject"
                      as="select"
                      value={attendanceForm.subjectId}
                      onChange={(e) =>
                        setAttendanceForm((prev) => ({
                          ...prev,
                          subjectId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subjectTitle(subject)}
                        </option>
                      ))}
                    </Field>
                    <Field
                      label="Date"
                      type="date"
                      value={attendanceForm.date}
                      onChange={(e) =>
                        setAttendanceForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                    <div className="flex items-end gap-3">
                      <button
                        type="button"
                        onClick={() => setAllStudentStatus("present")}
                        className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white"
                      >
                        Present All
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllStudentStatus("absent")}
                        className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 font-semibold text-white"
                      >
                        Absent All
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Student list
                        </p>
                        <p className="text-xs text-slate-500">
                          Subject-wise attendance mark karo.
                        </p>
                      </div>
                      {studentsLoading ? (
                        <span className="text-xs font-semibold text-slate-500">
                          Loading students...
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-4 grid gap-3">
                      {subjectStudents.length ? (
                        subjectStudents.map((student) => (
                          <div
                            key={student._id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-semibold">
                                  {student.name || "Student"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {student.wrn || student.enrollment || "-"}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {["present", "absent"].map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() =>
                                      setStudentStatus((prev) => ({
                                        ...prev,
                                        [student._id]: status,
                                      }))
                                    }
                                    className={`rounded-full px-4 py-2 text-xs font-semibold ${studentStatus[student._id] === status ? (status === "present" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white") : "bg-slate-100 text-slate-700"}`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <EmptyBlock label="Select a subject to load students." />
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleAttendanceSubmit}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white"
                  >
                    <FaSave />
                    Save Attendance
                  </button>
                </Panel>
              ) : null}
              {activePage === "academic" &&
              subActivePage === "marks" &&
              canManageMarks ? (
                <Panel title="Marks" subtitle="Marks entry workspace">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="Subject"
                      as="select"
                      value={markForm.subjectId}
                      onChange={(e) =>
                        setMarkForm((prev) => ({
                          ...prev,
                          subjectId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subjectTitle(subject)}
                        </option>
                      ))}
                    </Field>
                    <Field
                      label="Date"
                      type="date"
                      value={markForm.date}
                      onChange={(e) =>
                        setMarkForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleMarkSubmit}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white"
                      >
                        <FaSave />
                        Save Marks
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Marks grid
                        </p>
                        <p className="text-xs text-slate-500">
                          Loaded students ke marks fill karo.
                        </p>
                      </div>
                      {marksStudentsLoading ? (
                        <span className="text-xs font-semibold text-slate-500">
                          Loading students...
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-4 grid gap-3">
                      {marksStudents.length ? (
                        marksStudents.map((student) => (
                          <div
                            key={student._id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-semibold">
                                  {student.name || "Student"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {student.wrn || student.enrollment || "-"}
                                </p>
                              </div>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={marksByStudent[student._id] ?? ""}
                                onChange={(e) =>
                                  setMarksByStudent((prev) => ({
                                    ...prev,
                                    [student._id]: e.target.value,
                                  }))
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none sm:w-32"
                                placeholder="Marks"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <EmptyBlock label="Select a subject to load students." />
                      )}
                    </div>
                  </div>
                </Panel>
              ) : null}
              {activePage === "academic" &&
              subActivePage === "project" &&
              canManageProjects ? (
                <Panel title="Project" subtitle="Project assignment workspace">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="Subject"
                      as="select"
                      value={projectForm.subjectId}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          subjectId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subjectTitle(subject)}
                        </option>
                      ))}
                    </Field>
                    <Field
                      label="Due Date"
                      type="date"
                      value={projectForm.dueDate}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                    />
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleProjectSubmit}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white"
                      >
                        <FaSave />
                        Save Projects
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Project grid
                        </p>
                        <p className="text-xs text-slate-500">
                          Assign projects to students.
                        </p>
                      </div>
                      {projectStudentsLoading ? (
                        <span className="text-xs font-semibold text-slate-500">
                          Loading students...
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-4 grid gap-3">
                      {projectStudents.length ? (
                        projectStudents.map((student) => (
                          <div
                            key={student._id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900"
                          >
                            <div className="grid gap-3 lg:grid-cols-[220px_1fr_1.2fr] lg:items-start">
                              <div>
                                <p className="font-semibold">
                                  {student.name || "Student"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {student.wrn || student.enrollment || "-"}
                                </p>
                              </div>
                              <input
                                type="text"
                                value={projectsByStudent[student._id]?.title ?? ""}
                                onChange={(e) =>
                                  setProjectsByStudent((prev) => ({
                                    ...prev,
                                    [student._id]: {
                                      title: e.target.value,
                                      description:
                                        prev[student._id]?.description || "",
                                    },
                                  }))
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                                placeholder="Project title"
                              />
                              <textarea
                                value={projectsByStudent[student._id]?.description ?? ""}
                                onChange={(e) =>
                                  setProjectsByStudent((prev) => ({
                                    ...prev,
                                    [student._id]: {
                                      title: prev[student._id]?.title || "",
                                      description: e.target.value,
                                    },
                                  }))
                                }
                                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                                placeholder="Project description"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <EmptyBlock label="Select a subject to load students." />
                      )}
                    </div>
                  </div>
                </Panel>
              ) : null}
              {activePage === "academic" &&
              subActivePage === "subject" &&
              canUseAcademicSubjects ? (
                <Panel
                  title={
                    canManageSubjects
                      ? "Subject Management"
                      : "Assigned Subjects"
                  }
                  subtitle="Subject access"
                >
                  <Suspense
                    fallback={<PanelLoader label="Loading subjects..." />}
                  >
                    {canManageSubjects ? (
                      <SubjectManagement />
                    ) : (
                      <div className="overflow-hidden rounded-3xl border border-slate-200">
                        <div className="grid grid-cols-12 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          <div className="col-span-4">Subject</div>
                          <div className="col-span-3">Course</div>
                          <div className="col-span-2">Semester</div>
                          <div className="col-span-3">Section</div>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {subjects.length ? (
                            subjects.map((subject) => (
                              <div
                                key={subject._id}
                                className="grid grid-cols-12 px-4 py-4 text-sm text-slate-900"
                              >
                                <div className="col-span-4 font-medium">
                                  {subject.name || "-"}
                                </div>
                                <div className="col-span-3 text-slate-600">
                                  {subject.course || "-"}
                                </div>
                                <div className="col-span-2 text-slate-600">
                                  {subject.semester || "-"}
                                </div>
                                <div className="col-span-3 text-slate-600">
                                  {subject.section || "-"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-sm text-slate-500">
                              No assigned subjects.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "student" &&
              subActivePage === "student record" &&
              canStudentRecord ? (
                <Panel title="Student Record" subtitle="Student data access" scrollable>
                  <Suspense
                    fallback={
                      <PanelLoader label="Loading student records..." />
                    }
                  >
                    <StudentRecord />
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "student" &&
              subActivePage === "add student" &&
              canAddStudent ? (
                <Panel title="Add Student" subtitle="Student registration" scrollable>
                  <Suspense
                    fallback={<PanelLoader label="Loading student form..." />}
                  >
                    <StudentRegister />
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "teacher" &&
              subActivePage === "teacher record" &&
              canTeacherRecord ? (
                <Panel title="Teacher Record" subtitle="Staff data access" scrollable>
                  <Suspense
                    fallback={<PanelLoader label="Loading staff records..." />}
                  >
                    <TeacherRecord />
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "teacher" &&
              subActivePage === "add teacher" &&
              canAddTeacher ? (
                <Panel title="Add Teacher" subtitle="Create staff account" scrollable>
                  <Suspense
                    fallback={<PanelLoader label="Loading staff form..." />}
                  >
                    <TeacherRegister />
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "payment" &&
              subActivePage === "dashboard" &&
              canPaymentDashboard ? (
                <Panel title="Payment Dashboard" subtitle="Finance overview" scrollable>
                  <Suspense
                    fallback={
                      <PanelLoader label="Loading payment dashboard..." />
                    }
                  >
                    <PaymentDashboard />
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "payment" &&
              subActivePage === "pay fees" &&
              canPayFees ? (
                <Panel title="Pay Fees" subtitle="Fee collection workspace" scrollable>
                  <Suspense
                    fallback={<PanelLoader label="Loading fee collection..." />}
                  >
                    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <AllPayment notshow={false} />
                    </div>
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "payment" &&
              subActivePage === "payment history" &&
              canPaymentHistory ? (
                <Panel
                  title="Payment History"
                  subtitle="Approved payment records"
                  scrollable
                >
                  <Suspense
                    fallback={
                      <PanelLoader label="Loading payment history..." />
                    }
                  >
                    <PaymentHistory />
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "payment" &&
              subActivePage === "pending fees" &&
              canPendingFees ? (
                <Panel title="Pending Fees" subtitle="Outstanding fee tracker" scrollable>
                  <Suspense
                    fallback={<PanelLoader label="Loading pending fees..." />}
                  >
                    <PendingPayment />
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "payment" &&
              subActivePage === "pending request" &&
              canPendingRequest ? (
                <Panel
                  title="Pending Request"
                  subtitle="Payment approval queue"
                  scrollable
                >
                  <Suspense
                    fallback={
                      <PanelLoader label="Loading pending requests..." />
                    }
                  >
                    <PendingRequest />
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "expense" && canManageExpenses ? (
                <Panel title="Expense" subtitle="Expense entry and history" scrollable>
                  <Suspense
                    fallback={<PanelLoader label="Loading expenses..." />}
                  >
                    
                      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <AllExpenses />
                      </div>
                    
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "notice" && canManageNotices ? (
                <Panel title="Notice" subtitle="Notice management" scrollable>
                  <Suspense
                    fallback={<PanelLoader label="Loading notices..." />}
                  >
                    <NoticeManagement />
                  </Suspense>
                </Panel>
              ) : null}
              {activePage === "messages" && canManageMessages ? (
                <Panel title="Messages" subtitle="Message management" scrollable>
                  <Suspense
                    fallback={<PanelLoader label="Loading messages..." />}
                  >
                    <SendMessage />
                  </Suspense>
                </Panel>
              ) : null}


               {activePage === "staff_notice" &&
               (
                <Panel
                  title="Notice"
                  subtitle="Send By Administrator"
                  
                >
                  <Suspense
                    fallback={
                      <PanelLoader label="Loading payment history..." />
                    }
                  >
                    <StudentNotice forWhich = "teacher" />
                  </Suspense>
                </Panel>
              ) }
            </div>
          </div>
        </main>


      </div>
    </div>
  );
};

export default TeacherDashboard;
