import React, { useEffect, useState } from 'react'
import api from '../api/axios';
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

const TeacherDash = () => {
    const [teacher, setTeacher] = useState(false);
    const [editTeacher, setEditTeacher] = useState(null);
    const [totalTeacherInCollege, setTotalTeacherInCollege] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showTeacherEditModal, setShowTeacherEditModal] = useState(false);
    const [editTeacherForm, setEditTeacherForm] = useState({});

    useEffect(()=>{
        fetchAllTeachers();
    },[])

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

        
         // Start editing teacher
  const handleEditTeacher = (teacherData) => {
    setEditTeacher(teacherData);
    setEditTeacherForm(teacherData);
    setShowTeacherEditModal(true);
  };


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
  return (
    <>

       <div className="overflow-x-auto">
                                 <table className="w-full border-collapse border border-gray-300">
                                   <thead className="bg-gray-400">
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
                                         <td className="border p-3 flex gap-2 items-center justify-center">
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
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateTeacher}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
    </>
  )
}

export default TeacherDash