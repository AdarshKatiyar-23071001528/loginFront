import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../api/axios";
import { getSafeAssetUrl } from "../components/student/StudentProfileSheet";
import TeacherEditModal from "../components/teacher/TeacherEditModal";

const TeacherDash = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingTeacher, setEditingTeacher] = useState(null);

  const fetchAllTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teacher/allteacher");
      if (response.data.success) {
        setTeachers(response.data.teachers || []);
      }
    } catch (error) {
      setMessage(`Error fetching teachers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTeachers();
  }, []);

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      const response = await api.delete(`/teacher/delete/${teacherId}`);
      if (response.data.success) {
        setTeachers((prev) => prev.filter((teacher) => teacher._id !== teacherId));
        setMessage("Teacher deleted successfully");
      }
    } catch (error) {
      setMessage(`Error deleting teacher: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Teacher Admin
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Teacher Directory
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Manage full teacher profiles, uploaded images, signatures, and
              documents from one panel.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
              Total Teachers
            </p>
            <p className="mt-1 text-3xl font-black">{teachers.length}</p>
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-xl font-bold text-slate-900">Teachers</h2>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading teachers...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Post</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.length ? (
                  teachers.map((teacher) => (
                    <tr key={teacher._id} className="text-sm text-slate-700 hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          {getSafeAssetUrl(teacher.imgSrc) ? (
                            <img
                              src={getSafeAssetUrl(teacher.imgSrc)}
                              alt={teacher.name || "Teacher"}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                              {String(teacher.name || "T").charAt(0)}
                            </div>
                          )}
                          <span>{teacher.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">{teacher.email || "-"}</td>
                      <td className="px-5 py-4">{teacher.post || teacher.role || "-"}</td>
                      <td className="px-5 py-4">{teacher.mobile || "-"}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingTeacher(teacher)}
                            className="rounded-xl bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTeacher(teacher._id)}
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
                    <td colSpan="5" className="px-5 py-10 text-center text-sm text-slate-500">
                      No teachers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editingTeacher ? (
        <TeacherEditModal
          teacher={editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onSaved={(updatedTeacher) => {
            setTeachers((prev) =>
              prev.map((teacher) =>
                teacher._id === updatedTeacher._id ? updatedTeacher : teacher,
              ),
            );
            setEditingTeacher(null);
            setMessage("Teacher updated successfully");
          }}
        />
      ) : null}
    </div>
  );
};

export default TeacherDash;
