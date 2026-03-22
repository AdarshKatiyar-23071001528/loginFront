import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBook, FaCalendarAlt, FaChartLine, FaClipboardList, FaSave, FaUserTie } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import api from "../api/axios";
import { clearAuthToken, getAuthUser } from "../utils/auth";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const subjectTitle = (subject) => {
  if (!subject) return "-";
  if (typeof subject === "string") return subject;
  const parts = [subject?.name, subject?.course, subject?.semester ? `Sem ${subject.semester}` : "", subject?.section ? `Sec ${subject.section}` : ""].filter(Boolean);
  return parts.join(" - ");
};

const TeacherDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const permissions = authUser?.permissions || [];
  const canManageAttendance = permissions.includes("attendance.manage");
  const canManageMarks = permissions.includes("marks.manage");
  const canReadStudents = permissions.includes("students.read");
  const canReadSubjects = permissions.includes("subjects.read");

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(canManageAttendance ? "attendance" : canManageMarks ? "marks" : "logout");
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({ subjectId: "", date: "" });
  const [subjectStudents, setSubjectStudents] = useState([]);
  const [studentStatus, setStudentStatus] = useState({});
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [markForm, setMarkForm] = useState({ subjectId: "", date: "" });
  const [marksStudents, setMarksStudents] = useState([]);
  const [marksByStudent, setMarksByStudent] = useState({});
  const [marksStudentsLoading, setMarksStudentsLoading] = useState(false);

  const tabs = [
    ...(canManageAttendance ? [{ id: "attendance", label: "Attendance", icon: FaCalendarAlt }] : []),
    ...(canManageMarks ? [{ id: "marks", label: "Marks", icon: FaBook }] : []),
    { id: "logout", label: "Logout", icon: CiLogout },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const requests = [
          api.get(`/teacher/profile/${id}`),
          canManageAttendance ? api.get(`/attendance/teacher/${id}`) : Promise.resolve({ data: { records: [] } }),
          canReadStudents ? api.get("/student/allStudents") : Promise.resolve({ data: { students: [] } }),
          canManageMarks ? api.get(`/marks/teacher/${id}`) : Promise.resolve({ data: { marks: [] } }),
          canReadSubjects ? api.get(`/subject/teacher/${id}`) : Promise.resolve({ data: { subjects: [] } }),
        ];

        const [teacherRes, attendanceRes, studentsRes, marksRes, subjectsRes] = await Promise.all(requests);
        setTeacher(teacherRes.data.teacher || null);
        setAttendance(attendanceRes.data.records || []);
        setStudents(studentsRes.data.students || []);
        setMarks(marksRes.data.marks || []);
        setSubjects(subjectsRes.data.subjects || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, canManageAttendance, canManageMarks, canReadStudents, canReadSubjects]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!attendanceForm.subjectId || !canReadStudents) {
        setSubjectStudents([]);
        setStudentStatus({});
        return;
      }

      setStudentsLoading(true);
      try {
        const res = await api.get(`/attendance/students/${attendanceForm.subjectId}`);
        const list = res.data.students || [];
        setSubjectStudents(list);
        setStudentStatus((prev) => {
          const next = { ...prev };
          for (const student of list) {
            if (!next[student._id]) next[student._id] = "present";
          }
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
  }, [attendanceForm.subjectId, canReadStudents]);

  useEffect(() => {
    const loadMarksStudents = async () => {
      if (!markForm.subjectId || !canReadStudents) {
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
          for (const student of list) {
            if (next[student._id] === undefined) next[student._id] = "";
          }
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
  }, [markForm.subjectId, canReadStudents]);

  const stats = useMemo(
    () => [
      { label: "Subjects", value: subjects.length, icon: FaBook },
      { label: "Attendance Entries", value: attendance.length, icon: FaClipboardList },
      { label: "Marks Entries", value: marks.length, icon: FaChartLine },
      { label: "Students", value: students.length, icon: FaUserTie },
    ],
    [attendance.length, marks.length, students.length, subjects.length]
  );

  const setAllStudentStatus = (status) => {
    const next = {};
    for (const student of subjectStudents) next[student._id] = status;
    setStudentStatus(next);
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (!attendanceForm.subjectId || !attendanceForm.date || !canManageAttendance) return;

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
    } catch {
      alert("Attendance mark failed");
    }
  };

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    if (!markForm.subjectId || !canManageMarks) return;

    try {
      const records = marksStudents
        .map((student) => ({ studentId: student._id, marks: marksByStudent[student._id] }))
        .filter((item) => item.marks !== "" && item.marks !== null && item.marks !== undefined);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium backdrop-blur">Loading teacher dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Teacher Portal</p>
          <h1 className="mt-3 text-3xl font-black">Unable to load dashboard</h1>
          <p className="mt-3 text-slate-300">{error}</p>
          <button onClick={() => navigate("/login")} className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const teacherName = teacher?.name || "Teacher";
  const teacherMeta = [teacher?.destination, teacher?.email, teacher?.mobile].filter(Boolean).join(" - ");
  const noFeatureAccess = !canManageAttendance && !canManageMarks;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="border-b border-white/10 bg-white/5 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Staff Portal</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Welcome, {teacherName}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{teacherMeta || "Manage your assigned academic work from one workspace."}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                          <p className="mt-1 text-xl font-black text-white">{item.value}</p>
                        </div>
                        <span className="rounded-xl bg-white/10 p-3 text-white">
                          <Icon />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[280px_1fr] lg:px-8">
            <aside className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/95 p-5 text-slate-900 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-600 text-xl font-black text-white">
                    {teacherName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Staff</p>
                    <h2 className="text-xl font-black">{teacherName}</h2>
                    <p className="text-sm text-slate-600">{teacher?.role || teacher?.destination || "Department"}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <Line label="Email" value={teacher?.email || "-"} />
                  <Line label="Mobile" value={teacher?.mobile || "-"} />
                  <Line label="Role" value={teacher?.role || "-"} />
                  <Line label="Joining" value={formatDate(teacher?.joiningDate)} />
                </div>
              </div>

              <div className="grid gap-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={tab.id === "logout" ? () => { clearAuthToken(); navigate("/login"); } : () => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                        active ? "border-emerald-300/40 bg-emerald-400/15 text-white shadow-lg" : tab.id === "logout" ? "border-white/10 bg-white/5 text-red-400 hover:bg-white/10" : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-emerald-300 text-slate-950" : "bg-white/10 text-white"}`}>
                        <Icon />
                      </span>
                      <span>
                        <span className="block font-semibold">{tab.label}</span>
                        <span className="block text-xs text-slate-400">
                          {tab.id === "attendance" ? "Mark presence" : tab.id === "marks" ? "Enter marks" : "Logout from device"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <main className="space-y-6">
              {noFeatureAccess ? (
                <Panel title="Access Required" subtitle="No staff authority assigned">
                  <div className="mt-6 rounded-3xl border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500">
                    Admin ne abhi is account ko attendance ya marks authority assign nahi ki hai.
                  </div>
                </Panel>
              ) : null}

              {activeTab === "attendance" && canManageAttendance ? (
                <Panel title="Attendance" subtitle="Daily attendance workspace">
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <Field label="Subject" as="select" value={attendanceForm.subjectId} onChange={(e) => setAttendanceForm((prev) => ({ ...prev, subjectId: e.target.value }))}>
                      <option value="">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subjectTitle(subject)}
                        </option>
                      ))}
                    </Field>
                    <Field label="Date" type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm((prev) => ({ ...prev, date: e.target.value }))} />
                    <div className="flex items-end gap-3">
                      <button type="button" onClick={() => setAllStudentStatus("present")} className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500">
                        Present All
                      </button>
                      <button type="button" onClick={() => setAllStudentStatus("absent")} className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 font-semibold text-white transition hover:bg-rose-500">
                        Absent All
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Student list</p>
                        <p className="text-xs text-slate-500">Set each student status before saving.</p>
                      </div>
                      {studentsLoading ? <span className="text-xs font-semibold text-slate-500">Loading students...</span> : null}
                    </div>

                    <div className="mt-4 grid gap-3">
                      {subjectStudents.length ? (
                        subjectStudents.map((student) => (
                          <div key={student._id} className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-semibold">{student.name || "Student"}</p>
                                <p className="text-xs text-slate-500">{student.wrn || student.enrollment || "-"}</p>
                              </div>
                              <div className="flex gap-2">
                                {["present", "absent"].map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStudentStatus((prev) => ({ ...prev, [student._id]: status }))}
                                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                      studentStatus[student._id] === status ? status === "present" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">Select a subject to load students.</div>
                      )}
                    </div>
                  </div>

                  <button onClick={handleAttendanceSubmit} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
                    <FaSave />
                    Save Attendance
                  </button>
                </Panel>
              ) : null}

              {activeTab === "marks" && canManageMarks ? (
                <Panel title="Marks" subtitle="Marks entry workspace">
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <Field label="Subject" as="select" value={markForm.subjectId} onChange={(e) => setMarkForm((prev) => ({ ...prev, subjectId: e.target.value }))}>
                      <option value="">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subjectTitle(subject)}
                        </option>
                      ))}
                    </Field>
                    <Field label="Date" type="date" value={markForm.date} onChange={(e) => setMarkForm((prev) => ({ ...prev, date: e.target.value }))} />
                    <div className="flex items-end">
                      <button type="button" onClick={handleMarkSubmit} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
                        <FaSave />
                        Save Marks
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Marks grid</p>
                        <p className="text-xs text-slate-500">Enter marks for the loaded subject students.</p>
                      </div>
                      {marksStudentsLoading ? <span className="text-xs font-semibold text-slate-500">Loading students...</span> : null}
                    </div>

                    <div className="mt-4 grid gap-3">
                      {marksStudents.length ? (
                        marksStudents.map((student) => (
                          <div key={student._id} className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-semibold">{student.name || "Student"}</p>
                                <p className="text-xs text-slate-500">{student.wrn || student.enrollment || "-"}</p>
                              </div>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={marksByStudent[student._id] ?? ""}
                                onChange={(e) => setMarksByStudent((prev) => ({ ...prev, [student._id]: e.target.value }))}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-slate-400 sm:w-32"
                                placeholder="Marks"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">Select a subject to load students.</div>
                      )}
                    </div>
                  </div>
                </Panel>
              ) : null}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

const Panel = ({ title, subtitle, children }) => (
  <section className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{subtitle}</p>
      <h3 className="mt-1 text-2xl font-black">{title}</h3>
    </div>
    {children}
  </section>
);

const Field = ({ label, as = "input", children, ...props }) => {
  const Component = as;
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <Component {...props} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white">
        {children}
      </Component>
    </div>
  );
};

const Line = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="max-w-[60%] truncate text-sm font-semibold text-slate-900">{value}</span>
  </div>
);

export default TeacherDashboard;
