
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TeacherDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [markForm, setMarkForm] = useState({ subjectId: '', date: '' });
  const [marksStudents, setMarksStudents] = useState([]);
  const [marksByStudent, setMarksByStudent] = useState({});
  const [marksStudentsLoading, setMarksStudentsLoading] = useState(false);

  const [attendanceForm, setAttendanceForm] = useState({ subjectId: '', date: '' });
  const [subjectStudents, setSubjectStudents] = useState([]);
  const [studentStatus, setStudentStatus] = useState({});
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [editAttendanceId, setEditAttendanceId] = useState(null);
  const [editAttendanceForm, setEditAttendanceForm] = useState({ status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tRes, aRes, sRes, mRes, subRes] = await Promise.all([
          api.get(`/teacher/profile/${id}`),
          api.get(`/attendance/teacher/${id}`),
          api.get('/student/allStudents'),
          api.get(`/marks/teacher/${id}`),
          api.get(`/subject/teacher/${id}`),
        ]);
        setTeacher(tRes.data.teacher);
        setAttendance(aRes.data.records || []);
        setStudents(sRes.data.students || []);
        setMarks(mRes.data.marks || []);
        setSubjects(subRes.data.subjects || []);
      } catch (_err) {
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

  useEffect(() => {
    const fetchStudentsForSubject = async () => {
      if (!attendanceForm.subjectId) {
        setSubjectStudents([]);
        setStudentStatus({});
        return;
      }
      setStudentsLoading(true);
      try {
        const res = await api.get(`/attendance/students/${attendanceForm.subjectId}`);
        const list = res.data.students || [];
        setSubjectStudents(list);
        setStudentStatus(prev => {
          const next = { ...prev };
          for (const s of list) {
            if (!next[s._id]) next[s._id] = 'present';
          }
          return next;
        });
      } catch (_err) {
        setSubjectStudents([]);
        setStudentStatus({});
      } finally {
        setStudentsLoading(false);
      }
    };
    fetchStudentsForSubject();
  }, [attendanceForm.subjectId]);

  const setAllStudentStatus = status => {
    const next = {};
    for (const s of subjectStudents) next[s._id] = status;
    setStudentStatus(next);
  };

  const handleStudentStatusChange = (studentId, status) => {
    setStudentStatus(prev => ({ ...prev, [studentId]: status }));
  };

  const handleAttendanceSubmit = async e => {
    e.preventDefault();
    try {
      if (!attendanceForm.subjectId || !attendanceForm.date) return;
      const records = subjectStudents.map(s => ({
        studentId: s._id,
        status: studentStatus[s._id] || 'absent',
      }));
      await api.post('/attendance', { subjectId: attendanceForm.subjectId, teacherId: id, date: attendanceForm.date, records });
      setAttendanceForm(prev => ({ ...prev, date: '' }));
      // Refresh attendance
      const aRes = await api.get(`/attendance/teacher/${id}`);
      setAttendance(aRes.data.records || []);
    } catch (_err) {
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
    } catch (_err) {
      alert('Attendance update failed');
    }
  };

  // Marks entry
  const handleMarkChange = e => {
    const { name, value } = e.target;
    setMarkForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchStudentsForMarks = async () => {
      if (!markForm.subjectId) {
        setMarksStudents([]);
        setMarksByStudent({});
        return;
      }
      setMarksStudentsLoading(true);
      try {
        const res = await api.get(`/attendance/students/${markForm.subjectId}`);
        const list = res.data.students || [];
        setMarksStudents(list);
        setMarksByStudent(prev => {
          const next = { ...prev };
          for (const s of list) {
            if (next[s._id] === undefined) next[s._id] = '';
          }
          return next;
        });
      } catch (_err) {
        setMarksStudents([]);
        setMarksByStudent({});
      } finally {
        setMarksStudentsLoading(false);
      }
    };
    fetchStudentsForMarks();
  }, [markForm.subjectId]);

  const handleStudentMarksChange = (studentId, value) => {
    setMarksByStudent(prev => ({ ...prev, [studentId]: value }));
  };

  const clearMarks = () => {
    const next = {};
    for (const s of marksStudents) next[s._id] = '';
    setMarksByStudent(next);
  };

  const handleMarkSubmit = async e => {
    e.preventDefault();
    try {
      if (!markForm.subjectId) return;
      const records = marksStudents
        .map(s => ({ studentId: s._id, marks: marksByStudent[s._id] }))
        .filter(r => r.marks !== '' && r.marks !== null && r.marks !== undefined);

      if (records.length === 0) {
        alert('Please enter marks for at least one student');
        return;
      }

      await api.post('/marks/bulk', {
        subjectId: markForm.subjectId,
        teacherId: id,
        date: markForm.date || undefined,
        records,
      });
      setMarkForm(prev => ({ ...prev, date: '' }));
      clearMarks();
      // Refresh marks
      const mRes = await api.get(`/marks/teacher/${id}`);
      setMarks(mRes.data.marks || []);
    } catch (_err) {
      alert('Marks entry failed');
    }
  };

  const formatDate = d => {
    if (!d) return '-';
    const dt = new Date(d);
    return dt.toLocaleDateString();
  };

  const formatStatus = status => {
    const s = String(status || '').toLowerCase();
    if (s === 'present') return 'Present';
    if (s === 'absent') return 'Absent';
    return '-';
  };

  const subjectLabel = subj => {
    if (!subj) return '-';
    const name = subj?.name || '-';
    const meta = [subj?.course, subj?.semester ? `Sem ${subj.semester}` : null, subj?.section ? `Sec ${subj.section}` : null]
      .filter(Boolean)
      .join(' • ');
    return meta ? `${name} (${meta})` : name;
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
                <div className='flex items-start justify-between gap-3 mb-2'>
                  <div>
                    <h2 className='text-xl font-bold'>Mark Attendance</h2>
                    <p className='text-sm text-gray-600'>Select a subject, load students, then mark Present/Absent.</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      disabled={subjectStudents.length === 0}
                      onClick={() => setAllStudentStatus('present')}
                      className='px-3 py-1 rounded border bg-white hover:bg-gray-50 text-sm disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                      All Present
                    </button>
                    <button
                      type='button'
                      disabled={subjectStudents.length === 0}
                      onClick={() => setAllStudentStatus('absent')}
                      className='px-3 py-1 rounded border bg-white hover:bg-gray-50 text-sm disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                      All Absent
                    </button>
                  </div>
                </div>
                {subjects.length === 0 && (
                  <div className='mb-3 rounded border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-900'>
                    No subjects are assigned to your profile yet. Ask admin to assign subjects, then refresh.
                  </div>
                )}
                <form onSubmit={handleAttendanceSubmit} className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-4'>
                  <select name='subjectId' value={attendanceForm.subjectId} onChange={handleAttendanceChange} className='px-2 py-1 border rounded' required>
                    <option value=''>Select Subject</option>
                    {subjects.map(sub => <option key={sub._id} value={sub._id}>{subjectLabel(sub)}</option>)}
                  </select>
                  <input name='date' type='date' value={attendanceForm.date} onChange={handleAttendanceChange} className='px-2 py-1 border rounded' required />
                  <button
                    type='submit'
                    disabled={subjects.length === 0 || !attendanceForm.subjectId || !attendanceForm.date || subjectStudents.length === 0}
                    className='bg-blue-600 text-white px-2 py-1 rounded font-semibold disabled:opacity-60 disabled:cursor-not-allowed'
                  >
                    Save Attendance
                  </button>
                </form>

                <div className='mb-5'>
                  {!attendanceForm.subjectId ? (
                    <div className='rounded border bg-gray-50 px-3 py-3 text-sm text-gray-700'>
                      Select a subject to load students.
                    </div>
                  ) : studentsLoading ? (
                    <div className='rounded border bg-white px-3 py-3 text-sm text-gray-700'>
                      Loading students...
                    </div>
                  ) : subjectStudents.length === 0 ? (
                    <div className='rounded border bg-white px-3 py-3 text-sm text-gray-700'>
                      No students found for this subject.
                    </div>
                  ) : (
                    <div className='overflow-x-auto rounded border'>
                      <div className='px-3 py-2 text-xs text-gray-600 border-b bg-white flex items-center justify-between'>
                        <span>Total: {subjectStudents.length}</span>
                        <span>
                          Present: {subjectStudents.filter(s => (studentStatus[s._id] || 'absent') === 'present').length} • Absent:{' '}
                          {subjectStudents.filter(s => (studentStatus[s._id] || 'absent') === 'absent').length}
                        </span>
                      </div>
                      <table className='w-full table-auto text-sm'>
                        <thead className='bg-gray-50'>
                          <tr className='text-left text-gray-600 border-b'>
                            <th className='py-2 px-2'>Student</th>
                            <th className='py-2 px-2'>Roll</th>
                            <th className='py-2 px-2'>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectStudents.map(s => (
                            <tr key={s._id} className='border-b hover:bg-gray-50'>
                              <td className='py-2 px-2 font-medium text-gray-900'>{s.name || '-'}</td>
                              <td className='py-2 px-2 text-gray-700'>{s.rollno ?? '-'}</td>
                              <td className='py-2 px-2'>
                                <select
                                  value={studentStatus[s._id] || 'absent'}
                                  onChange={e => handleStudentStatusChange(s._id, e.target.value)}
                                  className='px-2 py-1 border rounded'
                                >
                                  <option value='present'>Present</option>
                                  <option value='absent'>Absent</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

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
                          <td className='py-1'>{att.subject?.name || '-'}</td>
                          <td className='py-1'>
                            {editAttendanceId === att._id ? (
                              <form onSubmit={handleEditAttendanceSubmit} className='flex items-center gap-1'>
                                <select value={editAttendanceForm.status} onChange={handleEditAttendanceChange} className='px-2 py-1 border rounded'>
                                  <option value='present'>Present</option>
                                  <option value='absent'>Absent</option>
                                </select>
                                <button type='submit' className='bg-green-600 text-white px-2 py-1 rounded'>Save</button>
                                <button type='button' onClick={() => setEditAttendanceId(null)} className='bg-gray-400 text-white px-2 py-1 rounded'>Cancel</button>
                              </form>
                            ) : (
                              <span className={String(att.status).toLowerCase() === 'present' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{formatStatus(att.status)}</span>
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
                {subjects.length === 0 && (
                  <div className='mb-3 rounded border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-900'>
                    No subjects are assigned to your profile yet. Ask admin to assign subjects, then refresh.
                  </div>
                )}
                <form onSubmit={handleMarkSubmit} className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-4'>
                  <select name='subjectId' value={markForm.subjectId} onChange={handleMarkChange} className='px-2 py-1 border rounded' required>
                    <option value=''>Select Subject</option>
                    {subjects.map(sub => <option key={sub._id} value={sub._id}>{subjectLabel(sub)}</option>)}
                  </select>
                  <input name='date' type='date' value={markForm.date} onChange={handleMarkChange} className='px-2 py-1 border rounded' />
                  <div className='flex items-center gap-2'>
                    <button
                      type='submit'
                      disabled={subjects.length === 0 || !markForm.subjectId || marksStudents.length === 0}
                      className='bg-blue-600 text-white px-3 py-1 rounded font-semibold disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                      Save Marks
                    </button>
                    <button type='button' disabled={marksStudents.length === 0} onClick={clearMarks} className='px-3 py-1 rounded border bg-white hover:bg-gray-50 text-sm disabled:opacity-60 disabled:cursor-not-allowed'>
                      Clear
                    </button>
                  </div>
                </form>

                <div className='mb-5'>
                  {!markForm.subjectId ? (
                    <div className='rounded border bg-gray-50 px-3 py-3 text-sm text-gray-700'>
                      Select a subject to load students.
                    </div>
                  ) : marksStudentsLoading ? (
                    <div className='rounded border bg-white px-3 py-3 text-sm text-gray-700'>
                      Loading students...
                    </div>
                  ) : marksStudents.length === 0 ? (
                    <div className='rounded border bg-white px-3 py-3 text-sm text-gray-700'>
                      No students found for this subject.
                    </div>
                  ) : (
                    <div className='overflow-x-auto rounded border'>
                      <div className='px-3 py-2 text-xs text-gray-600 border-b bg-white flex items-center justify-between'>
                        <span>Total: {marksStudents.length}</span>
                        <span>Filled: {marksStudents.filter(s => String(marksByStudent[s._id] ?? '').trim() !== '').length}</span>
                      </div>
                      <table className='w-full table-auto text-sm'>
                        <thead className='bg-gray-50'>
                          <tr className='text-left text-gray-600 border-b'>
                            <th className='py-2 px-2'>Student</th>
                            <th className='py-2 px-2'>Roll</th>
                            <th className='py-2 px-2'>Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marksStudents.map(s => (
                            <tr key={s._id} className='border-b hover:bg-gray-50'>
                              <td className='py-2 px-2 font-medium text-gray-900'>{s.name || '-'}</td>
                              <td className='py-2 px-2 text-gray-700'>{s.rollno ?? '-'}</td>
                              <td className='py-2 px-2'>
                                <input
                                  type='number'
                                  value={marksByStudent[s._id] ?? ''}
                                  onChange={e => handleStudentMarksChange(s._id, e.target.value)}
                                  placeholder='Enter marks'
                                  className='px-2 py-1 border rounded w-36'
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

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
                          <td className='py-1'>{m.subject?.name || '-'}</td>
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
    </div>
  );
};

export default TeacherDashboard;
