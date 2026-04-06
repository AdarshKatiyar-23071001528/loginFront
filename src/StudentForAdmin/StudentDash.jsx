import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaEye, FaPrint, FaTrash } from "react-icons/fa";
import api from "../api/axios";
import ViewStudent from "./ViewStudent";
import StudentEditModal from "../components/student/StudentEditModal";
import { printStudentProfile } from "../components/student/StudentProfileSheet";
import { getAuthUser } from "../utils/auth";

const formatProjectDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const StudentDash = () => {
  const authUser = useMemo(() => getAuthUser(), []);
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
  const [projectForm, setProjectForm] = useState({
    studentId: "",
    title: "",
    description: "",
    dueDate: "",
  });
  const [assigningProject, setAssigningProject] = useState(false);

  const canAssignProject =
    authUser?.role === "admin" ||
    authUser?.permissions?.includes("students.read") ||
    authUser?.permissions?.includes("students.manage");

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
    return students.filter(Boolean).filter((student) => {
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

  const handleProjectAssign = async (e) => {
    e.preventDefault();

    if (!projectForm.studentId || !projectForm.title.trim()) {
      setMessage("Please select a student and enter project title");
      return;
    }

    try {
      setAssigningProject(true);
      const response = await api.post(
        `/student/assign-project/${projectForm.studentId}`,
        {
          title: projectForm.title.trim(),
          description: projectForm.description.trim(),
          dueDate: projectForm.dueDate || null,
        },
      );

      if (response.data?.success) {
        const updatedStudent = response.data.student;
        setStudents((prev) =>
          prev.map((student) =>
            student._id === updatedStudent._id ? updatedStudent : student,
          ),
        );
        if (selectedStudent?._id === updatedStudent._id) {
          setSelectedStudent(updatedStudent);
        }
        if (editingStudent?._id === updatedStudent._id) {
          setEditingStudent(updatedStudent);
        }
        setProjectForm({
          studentId: "",
          title: "",
          description: "",
          dueDate: "",
        });
        setMessage(response.data.message || "Project assigned successfully");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to assign project");
    } finally {
      setAssigningProject(false);
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

      {canAssignProject ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Teacher Project Assignment
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Assign project to student
          </h2>

          <form
            onSubmit={handleProjectAssign}
            className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            <select
              value={projectForm.studentId}
              onChange={(e) =>
                setProjectForm((prev) => ({
                  ...prev,
                  studentId: e.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} {student.wrn ? `| ${student.wrn}` : ""}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Project title"
              value={projectForm.title}
              onChange={(e) =>
                setProjectForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
            <input
              type="date"
              value={projectForm.dueDate}
              onChange={(e) =>
                setProjectForm((prev) => ({
                  ...prev,
                  dueDate: e.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
            <button
              type="submit"
              disabled={assigningProject}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {assigningProject ? "Assigning..." : "Assign Project"}
            </button>
            <textarea
              placeholder="Project description"
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 md:col-span-2 xl:col-span-4"
            />
          </form>
        </section>
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
          <div className="overflow-y-auto h-[400px]
          ">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">WRN</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Semester</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">Latest Project</th>
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
                      <td className="px-1 py-4 break-words text-[12px]">{student.email || "-"}</td>
                      <td className="px-5 py-4">{student.mobile1 || "-"}</td>
                      <td className="px-5 py-4">
                        {student.assignedProjects?.[0]?.title ? (
                          <div>
                            <p className="font-semibold text-slate-900">
                              {student.assignedProjects[0].title}
                            </p>
                            <p className="text-xs text-slate-500">
                              Due {formatProjectDate(student.assignedProjects[0].dueDate)}
                            </p>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
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
                    <td colSpan="8" className="px-5 py-10 text-center text-sm text-slate-500">
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
          onStudentUpdated={(updatedStudent) => {
            setStudents((prev) =>
              prev.map((student) =>
                student._id === updatedStudent._id ? updatedStudent : student,
              ),
            );
            setSelectedStudent(updatedStudent);
            setMessage("Document deleted successfully");
          }}
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
            if (!updatedStudent?._id) {
              setEditingStudent(null);
              setSelectedStudent(null);
              setMessage("Student updated, but refreshed data was incomplete");
              fetchAllStudents();
              return;
            }
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
