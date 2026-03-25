import React, { useContext, useEffect, useMemo, useState } from "react";
import AppContext from "../src/Context/AppContext";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400";

const SubjectManagement = () => {
  const { createSubject, assignTeacher, getTeachers, getSubjects } =
    useContext(AppContext);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    course: "",
    semester: "",
    section: "",
  });
  const [assign, setAssign] = useState({ subjectId: "", teacherId: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let res = await getSubjects();
        if (res.success) setSubjects(res.subjects || []);

        res = await getTeachers();
        if (res.success) setTeachers(res.teachers || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const assignedCount = useMemo(
    () => subjects.filter((subject) => subject?.teacher?.name).length,
    [subjects],
  );

  const unassignedCount = subjects.length - assignedCount;

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await createSubject(form);
    setMessage(res.message);
    setMessageType(res.success ? "success" : "error");

    if (res.success) {
      setSubjects((prev) => [...prev, res.subject]);
      setForm({ name: "", course: "", semester: "", section: "" });
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const res = await assignTeacher(assign);
    setMessage(res.message);
    setMessageType(res.success ? "success" : "error");

    if (res.success) {
      setSubjects((prev) =>
        prev.map((subject) =>
          subject._id === res.subject._id ? res.subject : subject,
        ),
      );
      setAssign({ subjectId: "", teacherId: "" });
    }
  };

  return (
    <div className="space-y-6 bg-slate-100 p-4 md:p-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Academic Admin
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Subject Management
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Create semester-wise subjects, map them to sections, and assign
              teachers from one clean panel.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Total Subjects
              </p>
              <p className="mt-1 text-2xl font-black">{subjects.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Assigned
              </p>
              <p className="mt-1 text-2xl font-black">{assignedCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Pending
              </p>
              <p className="mt-1 text-2xl font-black">{unassignedCount}</p>
            </div>
          </div>
        </div>
      </section>

      {message ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            messageType === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Create
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Add Subject
              </h2>
            </div>
            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Course + Section
            </div>
          </div>

          <form onSubmit={handleCreate} className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <input
                className={inputClassName}
                placeholder="Subject name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <select
              className={inputClassName}
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              required
            >
              <option value="">Choose class</option>
              <option value="BBA">BBA</option>
              <option value="BCA">BCA</option>
            </select>

            <input
              type="number"
              min={1}
              max={6}
              className={inputClassName}
              value={form.semester}
              placeholder="Semester"
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              required
            />

            <div className="md:col-span-2">
              <input
                className={inputClassName}
                placeholder="Section"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 md:col-span-2"
            >
              Create Subject
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Mapping
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Assign Teacher
              </h2>
            </div>
            <div className="rounded-2xl bg-cyan-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Teacher Allocation
            </div>
          </div>

          <form onSubmit={handleAssign} className="mt-5 grid gap-4">
            <select
              className={inputClassName}
              value={assign.subjectId}
              onChange={(e) =>
                setAssign({ ...assign, subjectId: e.target.value })
              }
              required
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {`${subject.name} (${subject.course} S${subject.semester}-${subject.section})`}
                </option>
              ))}
            </select>

            <select
              className={inputClassName}
              value={assign.teacherId}
              onChange={(e) =>
                setAssign({ ...assign, teacherId: e.target.value })
              }
              required
            >
              <option value="">Select teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
            >
              Assign Teacher
            </button>
          </form>
        </section>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Directory
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Subject List
            </h2>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {loading ? "Refreshing..." : `${subjects.length} records`}
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading subjects and teachers...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Semester</th>
                  <th className="px-5 py-4">Section</th>
                  <th className="px-5 py-4">Teacher</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.length ? (
                  subjects.map((subject) => {
                    const teacherName = subject.teacher?.name || "-";
                    const isAssigned = Boolean(subject.teacher?.name);

                    return (
                      <tr
                        key={subject._id}
                        className="text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          {subject.name}
                        </td>
                        <td className="px-5 py-4">{subject.course || "-"}</td>
                        <td className="px-5 py-4">{subject.semester || "-"}</td>
                        <td className="px-5 py-4">{subject.section || "-"}</td>
                        <td className="px-5 py-4">{teacherName}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              isAssigned
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {isAssigned ? "Assigned" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No subjects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default SubjectManagement;
