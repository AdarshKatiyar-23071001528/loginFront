
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TeacherAttendance from '../../Users/TeacherAttendance';

const TeacherDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [markForm, setMarkForm] = useState({ studentId: '', subject: '', marks: '' });
  const [attendanceForm, setAttendanceForm] = useState({ studentId: '', subject: '', date: '', status: 'Present' });
  const [editAttendanceId, setEditAttendanceId] = useState(null);
  const [editAttendanceForm, setEditAttendanceForm] = useState({ status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tRes, aRes, sRes, mRes] = await Promise.all([
          api.get(`/teacher/profile/${id}`),
          api.get(`/attendance/teacher/${id}`),
          api.get('/student/all'),
          api.get(`/marks/teacher/${id}`),
        ]);
        setTeacher(tRes.data.teacher);
        setAttendance(aRes.data.records || []);
        setStudents(sRes.data.students || []);
        setMarks(mRes.data.marks || []);
      } catch (err) {
        setError('Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // Attendance marking
  const handleAttendanceChange = e => {
    const { name, value } = e.target;
    setAttendanceForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAttendanceSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/attendance/mark', { ...attendanceForm, teacherId: id });
      setAttendanceForm({ studentId: '', subject: '', date: '', status: 'Present' });
      // Refresh attendance
      const aRes = await api.get(`/attendance/teacher/${id}`);
      setAttendance(aRes.data.records || []);
    } catch (err) {
      alert('Attendance mark failed');
    }
  };

  // Attendance update
  const handleEditAttendance = att => {
    setEditAttendanceId(att._id);
    setEditAttendanceForm({ status: att.status });
  };
  const handleEditAttendanceChange = e => {
    setEditAttendanceForm({ status: e.target.value });
  };
  const handleEditAttendanceSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(`/attendance/update/${editAttendanceId}`, { status: editAttendanceForm.status });
      setEditAttendanceId(null);
      // Refresh attendance
      const aRes = await api.get(`/attendance/teacher/${id}`);
      setAttendance(aRes.data.records || []);
    } catch (err) {
      alert('Attendance update failed');
    }
  };

  // Marks entry
  const handleMarkChange = e => {
    const { name, value } = e.target;
    setMarkForm(prev => ({ ...prev, [name]: value }));
  };
  const handleMarkSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/marks/entry', { ...markForm, teacherId: id });
      setMarkForm({ studentId: '', subject: '', marks: '' });
      // Refresh marks
      const mRes = await api.get(`/marks/teacher/${id}`);
      setMarks(mRes.data.marks || []);
    } catch (err) {
      alert('Marks entry failed');
    }
  };

  const formatDate = d => {
    if (!d) return '-';
    const dt = new Date(d);
    return dt.toLocaleDateString();
  };

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='p-4 bg-white rounded shadow'>Loading dashboard...</div>
    </div>
  );
  if (error) return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='max-w-lg text-center bg-white p-4 rounded shadow'>
        <h2 className='text-xl font-bold mb-2'>Unable to load dashboard</h2>
        <p className='mb-4 text-gray-700'>{error}</p>
        <button onClick={() => navigate('/teacherlog')} className='px-4 py-2 bg-blue-600 text-white rounded'>Go to Login</button>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-white py-4 px-2'>
      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4'>
        {/* Sidebar */}
        <aside className='md:col-span-1 bg-white rounded shadow p-4 sticky top-4'>
          <div className='flex flex-col items-center text-center'>
            <div className='w-20 h-20 rounded-full bg-gray-200 mb-2 overflow-hidden flex items-center justify-center'>
              {teacher?.imgSrc ? (
                <img src={teacher.imgSrc} alt='avatar' className='w-full h-full object-cover' />
              ) : (
                <span className='text-xl text-gray-500'>{(teacher?.name || 'T').charAt(0)}</span>
              )}
            </div>
            <h3 className='text-lg font-bold'>{teacher?.name || 'Teacher'}</h3>
            <p className='text-xs text-gray-500 mt-1'>ID: {teacher?._id || '-'}</p>
          </div>
          <nav className='mt-4 space-y-2'>
            <button onClick={() => setActiveTab('attendance')} className={`w-full text-left px-2 py-1 rounded ${activeTab==='attendance' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50'}`}>Attendance</button>
            <button onClick={() => setActiveTab('marks')} className={`w-full text-left px-2 py-1 rounded ${activeTab==='marks' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50'}`}>Marks Entry</button>
          </nav>
        </aside>

        {/* Main content */}
        <main className='md:col-span-3'>
          <div className='bg-white rounded shadow p-4'>
            {activeTab === 'attendance' && (
              <div>
                <h2 className='text-xl font-bold mb-2'>Mark Attendance</h2>
                <form onSubmit={handleAttendanceSubmit} className='grid grid-cols-1 md:grid-cols-4 gap-2 mb-4'>
                  <select name='studentId' value={attendanceForm.studentId} onChange={handleAttendanceChange} className='px-2 py-1 border rounded' required>
                    <option value=''>Select Student</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <input name='subject' value={attendanceForm.subject} onChange={handleAttendanceChange} placeholder='Subject' className='px-2 py-1 border rounded' required />
                  <input name='date' type='date' value={attendanceForm.date} onChange={handleAttendanceChange} className='px-2 py-1 border rounded' required />
                  <select name='status' value={attendanceForm.status} onChange={handleAttendanceChange} className='px-2 py-1 border rounded'>
                    <option value='Present'>Present</option>
                    <option value='Absent'>Absent</option>
                  </select>
                  <button type='submit' className='bg-blue-600 text-white px-2 py-1 rounded font-semibold'>Mark</button>
                </form>
                <h2 className='text-xl font-bold mb-2'>Attendance Records</h2>
                <div className='overflow-x-auto'>
                  <table className='w-full table-auto text-sm'>
                    <thead>
                      <tr className='text-left text-gray-600 border-b'>
                        <th className='py-1'>Date</th>
                        <th className='py-1'>Student</th>
                        <th className='py-1'>Subject</th>
                        <th className='py-1'>Status</th>
                        <th className='py-1'>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map(att => (
                        <tr key={att._id} className='border-b hover:bg-gray-50'>
                          <td className='py-1'>{formatDate(att.date)}</td>
                          <td className='py-1'>{att.student?.name || '-'}</td>
                          <td className='py-1'>{att.subject?.name || (typeof att.subject === 'string' ? att.subject : '-')}</td>
                          <td className='py-1'>
                            {editAttendanceId === att._id ? (
                              <form onSubmit={handleEditAttendanceSubmit} className='flex items-center gap-1'>
                                <select value={editAttendanceForm.status} onChange={handleEditAttendanceChange} className='px-2 py-1 border rounded'>
                                  <option value='Present'>Present</option>
                                  <option value='Absent'>Absent</option>
                                </select>
                                <button type='submit' className='bg-green-600 text-white px-2 py-1 rounded'>Save</button>
                                <button type='button' onClick={() => setEditAttendanceId(null)} className='bg-gray-400 text-white px-2 py-1 rounded'>Cancel</button>
                              </form>
                            ) : (
                              <span className={att.status === 'Present' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{att.status || 'Absent'}</span>
                            )}
                          </td>
                          <td className='py-1'>
                            {editAttendanceId !== att._id && (
                              <button onClick={() => handleEditAttendance(att)} className='bg-yellow-500 text-white px-2 py-1 rounded'>Edit</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'marks' && (
              <div>
                <h2 className='text-xl font-bold mb-2'>Marks Entry</h2>
                <form onSubmit={handleMarkSubmit} className='grid grid-cols-1 md:grid-cols-4 gap-2 mb-4'>
                  <select name='studentId' value={markForm.studentId} onChange={handleMarkChange} className='px-2 py-1 border rounded' required>
                    <option value=''>Select Student</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <input name='subject' value={markForm.subject} onChange={handleMarkChange} placeholder='Subject' className='px-2 py-1 border rounded' required />
                  <input name='marks' type='number' value={markForm.marks} onChange={handleMarkChange} placeholder='Marks' className='px-2 py-1 border rounded' required />
                  <button type='submit' className='bg-blue-600 text-white px-2 py-1 rounded font-semibold'>Add</button>
                </form>
                <h2 className='text-xl font-bold mb-2'>Marks Records</h2>
                <div className='overflow-x-auto'>
                  <table className='w-full table-auto text-sm'>
                    <thead>
                      <tr className='text-left text-gray-600 border-b'>
                        <th className='py-1'>Student</th>
                        <th className='py-1'>Subject</th>
                        <th className='py-1'>Marks</th>
                        <th className='py-1'>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map(m => (
                        <tr key={m._id} className='border-b hover:bg-gray-50'>
                          <td className='py-1'>{m.student?.name || '-'}</td>
                          <td className='py-1'>{m.subject || '-'}</td>
                          <td className='py-1'>{m.marks}</td>
                          <td className='py-1'>{formatDate(m.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        
        </main>
      </div>
            <div>
              <TeacherAttendance teacherId={teacher._id} />
            </div>
          
      
    </div>
  );
};

export default TeacherDashboard;