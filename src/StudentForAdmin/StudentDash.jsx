import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaEye, FaPrint, FaTrash } from "react-icons/fa";
import api from "../api/axios";
import ViewStudent from "./ViewStudent";
import StudentEditModal from "../components/student/StudentEditModal";
import { printStudentProfile } from "../components/student/StudentProfileSheet";

const StudentDash = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    wrn: "",
    course: "",
    semester: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/student/allStudents`);
      if (response.data.success) {
        setStudents(response.data.students || []);
      }
    } catch (error) {
      setMessage(`Error fetching students: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const search = filters.search.toLowerCase();
      const matchesSearch =
        !search ||
        [
          student.name,
          student.email,
          student.mobile1,
          student.rollno,
          student.enrollment,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search);

      const matchesWRN = !filters.wrn
        ? true
        : String(student.wrn || "")
            .toLowerCase()
            .includes(filters.wrn.toLowerCase());

      const matchesCourse = !filters.course
        ? true
        : String(student.course || "")
            .toLowerCase()
            .includes(filters.course.toLowerCase());

      const matchesSemester = !filters.semester
        ? true
        : String(student.semester || "") === String(filters.semester);

      return matchesSearch && matchesWRN && matchesCourse && matchesSemester;
    });
  }, [students, filters]);

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      const response = await api.delete(`/student/profile/delete/${studentId}`);
      if (response.data.success) {
        setStudents((prev) => prev.filter((student) => student._id !== studentId));
        setMessage("Student deleted successfully");
      }
    } catch (error) {
      setMessage(`Error deleting student: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Student Admin
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Student Directory
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              View full student profiles, inspect uploaded images and documents,
              print professional records, and edit any field from one panel.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
              Total Students
            </p>
            <p className="mt-1 text-3xl font-black">{students.length}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            placeholder="Search name, email, roll no"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
          <input
            type="text"
            placeholder="Filter WRN"
            value={filters.wrn}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, wrn: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
          <input
            type="text"
            placeholder="Filter course"
            value={filters.course}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, course: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
          <select
            value={filters.semester}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, semester: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="">All semesters</option>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <option key={item} value={item}>
                Semester {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-xl font-bold text-slate-900">Students</h2>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading students...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">WRN</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Semester</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length ? (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="text-sm text-slate-700 hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {student.name}
                      </td>
                      <td className="px-5 py-4">{student.wrn || "-"}</td>
                      <td className="px-5 py-4">{student.course || "-"}</td>
                      <td className="px-5 py-4">{student.semester || "-"}</td>
                      <td className="px-5 py-4">{student.email || "-"}</td>
                      <td className="px-5 py-4">{student.mobile1 || "-"}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            className="rounded-xl bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                          >
                            <FaEye />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStudent(student)}
                            className="rounded-xl bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => printStudentProfile(student)}
                            className="rounded-xl bg-slate-900 px-3 py-2 text-white hover:bg-slate-800"
                          >
                            <FaPrint />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(student._id)}
                            className="rounded-xl bg-rose-600 px-3 py-2 text-white hover:bg-rose-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-sm text-slate-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedStudent ? (
        <ViewStudent
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEdit={(student) => {
            setSelectedStudent(null);
            setEditingStudent(student);
          }}
        />
      ) : null}

      {editingStudent ? (
        <StudentEditModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSaved={(updatedStudent) => {
            setStudents((prev) =>
              prev.map((student) =>
                student._id === updatedStudent._id ? updatedStudent : student,
              ),
            );
            setEditingStudent(null);
            setSelectedStudent(updatedStudent);
            setMessage("Student updated successfully");
          }}
        />
      ) : null}
    </div>
  );
};

export default StudentDash;
