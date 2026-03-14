import React, { useState, useEffect } from 'react';
import api from '../src/api/axios';

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', isFor: 'all' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

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

  return (
    <div className="w-full h-full p-4 rounded">
      <h2 className="text-2xl font-bold mb-4">Notice Management</h2>
      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">{message}</div>}
      
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

      <div className="bg-white rounded shadow p-4 h-screen overflow-y-scroll">
        <h3 className="text-xl font-semibold mb-4">All Notices</h3>
        {notices.length === 0 ? (
          <p>No notices found.</p>
        ) : (
          <ul className="gap-4 flex flex-col p-4 ">
            {notices.map((notice) => (
              <li key={notice._id} className="border p-4 rounded  bg-gray-300">
                <h4 className="font-bold">{notice.title}</h4>
                <p>{notice.description}</p>
                <p className="text-sm text-gray-600">View: {notice.isFor}</p>
                <p className="text-sm text-gray-600">Date: {new Date(notice.date).toLocaleDateString()}</p>
                <div className="mt-2 gap-2 flex items-center">
                  <button onClick={() => handleEdit(notice)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(notice._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NoticeManagement;
