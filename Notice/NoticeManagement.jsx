import React, { useState, useEffect } from 'react';
import api from '../src/api/axios';
import { FaEye,FaTimes } from 'react-icons/fa';

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', isFor: 'all' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
    const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notice/all');
      if (response.data.success) {
        setNotices(response.data.result);
      } else {
        setMessage('Failed to fetch notices');
      }
    } catch (error) {
      setMessage('Error fetching notices: ' + error.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const response = await api.put(`/notice/update/${editingId}`, formData);
        if (response.data.success) {
          setMessage('Notice updated successfully');
          fetchNotices();
          resetForm();
        } else {
          setMessage('Failed to update notice');
        }
      } else {
        const response = await api.post('/notice/create', formData);
        if (response.data.success) {
          setMessage('Notice created successfully');
          fetchNotices();
          resetForm();
        } else {
          setMessage('Failed to create notice');
        }
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleEdit = (notice) => {
    setFormData({ title: notice.title, description: notice.description, isFor: notice.isFor });
    setEditingId(notice._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setLoading(true);
      try {
        const response = await api.delete(`/notice/delete/${id}`);
        if (response.data.success) {
          setMessage('Notice deleted successfully');
          fetchNotices();
        } else {
          setMessage('Failed to delete notice');
        }
      } catch (error) {
        setMessage('Error deleting notice: ' + error.message);
      }
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', isFor: 'all' });
    setEditingId(null);
  };

   const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
  return (
    <div className="w-full h-full p-4 rounded">
      {/* <h2 className="text-2xl font-bold mb-4">Notice Management</h2> */}
      {/* {message && <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">{message}</div>} */}
      
      

      

     

    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col">


      <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded shadow">
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">View</label>
          <select
            value={formData.isFor}
            onChange={(e) => setFormData({ ...formData, isFor: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="all">All</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div className="flex items-center gap-2">

           <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {editingId ? 'Update Notice' : 'Add Notice'}
        </button>
        {editingId && <button type="button" onClick={resetForm} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>}
          </div>
       
      </form>


      {loading && <div className="text-center">Loading...</div>}
  

      {/* Scrollable container */}
      <div className="overflow-y-auto max-h-[75vh] grid gap-4 md:grid-cols-2 lg:grid-cols-3 pr-2">
        {notices.map((notice, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-200 relative"
          >
            {/* Date */}
            <p className="text-sm text-gray-500 mb-2">
              📅 {formatDate(notice.date)}
            </p>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {notice.title}
            </h2>

            {/* Description (truncated) */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {notice.description}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              <span>View : </span>{notice.isFor}
            </p>

            {/* View Button */}
            <button
              onClick={() => setModalData(notice)}
              className="absolute top-5 right-5 text-blue-600 hover:text-blue-800"
              title="View Notice"
            >
              <FaEye size={18} />
            </button>

            <div className="mt-2 gap-2 flex items-center ">
                  <button onClick={() => handleEdit(notice)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(notice._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>


          </div>
        ))}
      </div>

      {notices.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No notices available
        </p>
      )}

      {/* Modal */}

{modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>

            <p className="text-sm text-gray-500 mb-2">
              📅 {formatDate(modalData.date)}
            </p>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {modalData.title}
            </h2>
            <p className="text-gray-700">{modalData.description}</p>
          </div>
        </div>
      )}



     
    </div>







      
    </div>
  );
};

export default NoticeManagement;
