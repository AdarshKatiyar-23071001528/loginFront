import React, { useEffect, useState } from 'react';
import api from '../src/api/axios';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

const AllStudents = ({ onEdit }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await api.get('/student/allStudents');
        if (res.data && res.data.success) {
          setStudents(res.data.students || []);
        } else {
          setError(res.data.message || 'Failed to load students');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error fetching students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-lg">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        <p>{error}</p>
      </div>
    );
  }

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const res = await api.delete(`/student/profile/delete/${id}`);
      if (res.data && res.data.success) {
        setStudents(prev => prev.filter(s => s._id !== id));
      } else {
        alert(res.data.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting student');
    }
  };

  const handleEdit = stu => {
    if (onEdit) onEdit(stu);
    else alert('Edit student: ' + stu._id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">#</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Roll</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Enrollment</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu, idx) => (
            <tr key={stu._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{idx + 1}</td>
              <td className="py-2 px-4">{stu.name}</td>
              <td className="py-2 px-4">{stu.rollno || '-'}</td>
              <td className="py-2 px-4">{stu.email}</td>
              <td className="py-2 px-4">{stu.enrollment || '-'}</td>
              <td className="py-2 px-4 flex gap-2">
                <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(stu)}>
                  <HiOutlinePencil />
                </button>
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(stu._id)}>
                  <HiOutlineTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllStudents;
