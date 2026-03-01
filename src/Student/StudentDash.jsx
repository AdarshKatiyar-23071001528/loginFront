import React from 'react'




import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'

const StudentDash = () => {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const queryId = query.get('id')
  const studentId = paramId || queryId || null

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState(null)
  const [attendance, setAttendance] = useState([])

  useEffect(() => {
    if (!studentId) {
      setLoading(false)
      setError('No student id provided. Please log in to view your dashboard.')
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const [pRes, aRes] = await Promise.all([
          api.get(`/student/profile/${studentId}`),
          api.get(`/attendance/student/${studentId}`),
        ])

        if (pRes.data && pRes.data.success) setProfile(pRes.data.student)
        else setError(pRes.data.message || 'Failed to load profile')

        if (aRes.data && aRes.data.success) setAttendance(aRes.data.attendance || [])
        else setAttendance([])
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || 'Error fetching dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [studentId])

  const formatDate = (d) => {
    if (!d) return '-'
    const dt = new Date(d)
    return dt.toLocaleDateString()
  }

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='p-6 bg-white rounded-lg shadow'>Loading dashboard...</div>
    </div>
  )

  if (error) return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='max-w-lg text-center bg-white p-8 rounded-lg shadow'>
        <h2 className='text-2xl font-bold mb-2'>Unable to load dashboard</h2>
        <p className='mb-4 text-gray-700'>{error}</p>
        <div className='flex gap-3 justify-center'>
          <button onClick={() => navigate('/studentlog')} className='px-4 py-2 bg-blue-600 text-white rounded'>Go to Login</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-white py-10 px-4'>
      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* Sidebar */}
        <aside className='md:col-span-1 bg-white rounded-lg shadow p-6 sticky top-6'>
          <div className='flex flex-col items-center text-center'>
            <div className='w-24 h-24 rounded-full bg-gray-200 mb-3 overflow-hidden flex items-center justify-center'>
              {profile?.imgSrc ? (
                <img src={profile.imgSrc} alt='avatar' className='w-full h-full object-cover' />
              ) : (
                <span className='text-2xl text-gray-500'>{(profile?.name || 'U').charAt(0)}</span>
              )}
            </div>
            <h3 className='text-xl font-bold'>{profile?.name || 'Student'}</h3>
            <p className='text-sm text-gray-500 mt-1'>Roll: {profile?.rollno || '-'}</p>
            <p className='text-sm text-gray-500'>Enrollment: {profile?.enrollment || '-'}</p>
          </div>

          <nav className='mt-6 space-y-2'>
            <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-2 rounded-md ${activeTab==='profile' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50'}`}>Profile</button>
            <button onClick={() => setActiveTab('attendance')} className={`w-full text-left px-4 py-2 rounded-md ${activeTab==='attendance' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50'}`}>Attendance</button>
            <button onClick={() => setActiveTab('fees')} className={`w-full text-left px-4 py-2 rounded-md ${activeTab==='fees' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50'}`}>Fees & Payments</button>
          </nav>
        </aside>

        {/* Main content */}
        <main className='md:col-span-3'>
          <div className='bg-white rounded-lg shadow p-6'>
            {activeTab === 'profile' && (
              <div>
                <h2 className='text-2xl font-bold mb-4'>Profile</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Name</p>
                    <p className='font-medium'>{profile?.name || '-'}</p>

                    <p className='text-sm text-gray-500 mt-3'>Email</p>
                    <p className='font-medium'>{profile?.email || '-'}</p>

                    <p className='text-sm text-gray-500 mt-3'>Roll Number</p>
                    <p className='font-medium'>{profile?.rollno || '-'}</p>

                    <p className='text-sm text-gray-500 mt-3'>Enrollment</p>
                    <p className='font-medium'>{profile?.enrollment || '-'}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500'>Father's Name</p>
                    <p className='font-medium'>{profile?.fathername || '-'}</p>

                    <p className='text-sm text-gray-500 mt-3'>Mother's Name</p>
                    <p className='font-medium'>{profile?.mothername || '-'}</p>

                    <p className='text-sm text-gray-500 mt-3'>Date of Birth</p>
                    <p className='font-medium'>{formatDate(profile?.dob)}</p>

                    <p className='text-sm text-gray-500 mt-3'>Address</p>
                    <p className='font-medium'>{profile?.address || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <h2 className='text-2xl font-bold mb-4'>Attendance</h2>
                {attendance.length === 0 ? (
                  <p className='text-gray-600'>No attendance records available.</p>
                ) : (
                  <div className='overflow-x-auto'>
                    <table className='w-full table-auto'>
                      <thead>
                        <tr className='text-left text-sm text-gray-600 border-b'>
                          <th className='py-2'>Date</th>
                          <th className='py-2'>Subject</th>
                          <th className='py-2'>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((rec) => (
                          <tr key={rec._id} className='border-b hover:bg-gray-50'>
                            <td className='py-3'>{formatDate(rec.date)}</td>
                            <td className='py-3'>{rec.subjectName || rec.subject || '-'}</td>
                            <td className='py-3'>{rec.status || rec.present ? 'Present' : 'Absent'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'fees' && (
              <div>
                <h2 className='text-2xl font-bold mb-4'>Fees & Payments</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-sm text-gray-500'>Total Fees</p>
                    <p className='text-2xl font-bold'>₹ {profile?.totalfees ?? 0}</p>

                    <p className='text-sm text-gray-500 mt-4'>Paid</p>
                    <p className='text-xl font-semibold text-green-600'>₹ {profile?.paidfees ?? 0}</p>

                    <p className='text-sm text-gray-500 mt-4'>Due</p>
                    <p className='text-xl font-semibold text-red-600'>₹ {(profile?.totalfees ?? 0) - (profile?.paidfees ?? 0)}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500'>Payment History</p>
                    <div className='mt-3 space-y-3 max-h-64 overflow-y-auto'>
                      {(profile?.payments && profile.payments.length > 0) ? (
                        profile.payments.map((p) => (
                          <div key={p._id} className='p-3 bg-white border rounded flex justify-between items-center'>
                            <div>
                              <div className='text-sm font-medium'>₹ {p.amount}</div>
                              <div className='text-xs text-gray-500'>{p.paymentMethod} • {formatDate(p.paidAt)}</div>
                            </div>
                            <div className={`text-sm font-semibold ${p.status==='approved' ? 'text-green-600' : p.status==='rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {p.status}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className='text-gray-600'>No payments found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentDash