import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { FaTrash, FaEdit, FaPrint } from "react-icons/fa";

const StudentDash = () => {
  const [wrnFilter, setWrnFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [studentInCollege, setStudentInCollege] = useState(0);
  const [editStudent, setEditStudent] = useState(null);
  const [editStudentForm, setEditStudentForm] = useState({});
  const [showStudentEditModal, setShowStudentEditModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/student/allStudents`);

      if (response.data.success) {
        setStudents(response.data.students);
        setStudentInCollege(response.data.students.length);
      }
    } catch (error) {
      setMessage("Error fetching students: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter students
  //   const filteredStudents = students.filter((student) => {

  //     const search = searchTerm.toLowerCase();

  //     const matchSearch =
  //       student.name?.toLowerCase().includes(search) ||
  //       student.fathername?.toLowerCase().includes(search) ||
  //       student.wrn?.toLowerCase().includes(search) ||
  //       student.rollno?.toString().includes(search);

  //     const matchSemester = semesterFilter
  //       ? student.semester === Number(semesterFilter)
  //       : true;

  //     return matchSearch && matchSemester;
  //   });

  const filteredStudents = students.filter((student) => {
    const matchWRN = wrnFilter
      ? student.wrn?.toLowerCase().includes(wrnFilter.toLowerCase())
      : true;

    const matchName = nameFilter
      ? student.name?.toLowerCase().includes(nameFilter.toLowerCase())
      : true;

    const matchCourse = courseFilter ? student.course === courseFilter : true;

    const matchSemester = semesterFilter
      ? student.semester === Number(semesterFilter)
      : true;

    return matchWRN && matchName && matchCourse && matchSemester;
  });

  const handleEditStudent = (student) => {
    setEditStudent(student);
    setEditStudentForm(student);
    setShowStudentEditModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await api.delete(
          `/student/profile/delete/${studentId}`,
        );

        if (response.data.success) {
          setStudents(students.filter((s) => s._id !== studentId));
          setMessage("Student deleted successfully");
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        setMessage("Error deleting student: " + error.message);
      }
    }
  };

  const handleUpdateStudent = async () => {
    try {
      const response = await api.put(
        `/student/profile/update/${editStudentForm._id}`,
        editStudentForm,
      );

      if (response.data.success) {
        setShowStudentEditModal(false);
        fetchAllStudents();
        setMessage("Student updated successfully");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("Error updating student: " + error.message);
    }
  };

const handlePrintStudent = (student) => {

  const printWindow = window.open("", "_blank", "width=900,height=700");

  const today = new Date().toLocaleDateString();
  const logoUrl = `${window.location.origin}/logo.png`;
  const defaultPhoto = `${window.location.origin}/default-student.png`;

  const html = `
  <html>
  <head>
    <title>Student Profile</title>

    <style>
      body{
        font-family: Arial;
        padding:30px;
      }

      .header{
        display:flex;
        align-items:center;
        border-bottom:2px solid #000;
        padding-bottom:10px;
        margin-bottom:20px;
      }

      .logo{
        width:80px;
        margin-right:20px;
      }

      .college{
        flex:1;
        text-align:center;
      }

      .college h1{
        margin:0;
        font-size:24px;
      }

      .college p{
        margin:0;
        font-size:14px;
      }

      .profile-section{
        display:flex;
        justify-content:space-between;
        margin-bottom:20px;
      }

      .photo{
        width:120px;
        height:140px;
        border:1px solid #000;
        object-fit:cover;
      }

      table{
        width:100%;
        border-collapse:collapse;
      }

      td,th{
        border:1px solid #000;
        padding:8px;
      }

      th{
        background:#f0f0f0;
        width:30%;
      }

      .signature{
        margin-top:60px;
        display:flex;
        justify-content:space-between;
      }

      .line{
        border-top:1px solid #000;
        margin-top:40px;
        width:200px;
      }

      .date{
        text-align:right;
        margin-top:10px;
      }

    </style>
  </head>

  <body>

    <div class="header">

      <img class="logo" src="${logoUrl}" />

      <div class="college">
        <h1>Shakuntala Krishan Institute of Technology</h1>
        <p>Affiliated to CSJMU University</p>
        <p>Kanpur Dehat, Uttar Pradesh</p>
      </div>

    </div>

    <h2 style="text-align:center;">Student Profile</h2>

    <div class="profile-section">

      <table>

        <tr>
          <th>Name</th>
          <td>${student.name}</td>
        </tr>

        <tr>
          <th>WRN</th>
          <td>${student.wrn}</td>
        </tr>

        <tr>
          <th>Course</th>
          <td>${student.course}</td>
        </tr>

        <tr>
          <th>Semester</th>
          <td>${student.semester}</td>
        </tr>

        <tr>
          <th>Roll No</th>
          <td>${student.rollno}</td>
        </tr>

        <tr>
          <th>Email</th>
          <td>${student.email}</td>
        </tr>

        <tr>
          <th>Mobile</th>
          <td>${student.mobile1}</td>
        </tr>

      </table>

      <img class="photo" src="${student.photo || defaultPhoto}" />

    </div>

    <div class="date">
      Print Date: ${today}
    </div>

    <div class="signature">

      <div>
        <div class="line"></div>
        Student Signature
      </div>

      <div>
        <div class="line"></div>
        Authorized Signature
      </div>

    </div>

  </body>
  </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // wait for images to load
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
};



  return (
    <>
      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap gap-3 mb-4 p-2">
        {/* WRN Filter */}
        <input
          type="text"
          placeholder="Search WRN"
          value={wrnFilter}
          onChange={(e) => setWrnFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />

        {/* Name Filter */}
        <input
          type="text"
          placeholder="Search Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />

        {/* Course Filter */}
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Courses</option>
          <option value="BCA">BCA</option>
          <option value="BBA">BBA</option>
        </select>

        {/* Semester Filter */}
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Semester</option>
          <option value="1">Sem 1</option>
          <option value="2">Sem 2</option>
          <option value="3">Sem 3</option>
          <option value="4">Sem 4</option>
          <option value="5">Sem 5</option>
          <option value="6">Sem 6</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">WRN</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Roll No</th>
              <th className="border p-3">Mobile</th>
              <th className="border p-3">Semester</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-100">
                <td className="border p-3">{student.name}</td>
                <td className="border p-3">{student.wrn}</td>
                <td className="border p-3">{student.email}</td>
                <td className="border p-3">{student.rollno}</td>
                <td className="border p-3">{student.mobile1}</td>
                <td className="border p-3">{student.semester}</td>

                <td className="border p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEditStudent(student)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDeleteStudent(student._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>


                  <button
    onClick={() => handlePrintStudent(student)}
    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
  >
    <FaPrint />
  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}

      {showStudentEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full">
            <div className="bg-blue-600 text-white p-4 flex justify-between">
              <h3 className="text-xl font-bold">Edit Student</h3>

              <button
                onClick={() => setShowStudentEditModal(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editStudentForm.name || ""}
                onChange={(e) =>
                  setEditStudentForm({
                    ...editStudentForm,
                    name: e.target.value,
                  })
                }
                className="w-full border px-3 py-2"
              />

              <input
                type="email"
                placeholder="Email"
                value={editStudentForm.email || ""}
                onChange={(e) =>
                  setEditStudentForm({
                    ...editStudentForm,
                    email: e.target.value,
                  })
                }
                className="w-full border px-3 py-2"
              />

              <input
                type="text"
                placeholder="Mobile"
                value={editStudentForm.mobile1 || ""}
                onChange={(e) =>
                  setEditStudentForm({
                    ...editStudentForm,
                    mobile1: e.target.value,
                  })
                }
                className="w-full border px-3 py-2"
              />

              <input
                type="text"
                placeholder="Roll No"
                value={editStudentForm.rollno || ""}
                onChange={(e) =>
                  setEditStudentForm({
                    ...editStudentForm,
                    rollno: e.target.value,
                  })
                }
                className="w-full border px-3 py-2"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowStudentEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateStudent}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDash;
