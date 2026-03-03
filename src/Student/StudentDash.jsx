




import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'

const StudentDash = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: paramId } = useParams()
  
  // Get studentId from URL param or query string
  const query = new URLSearchParams(location.search)
  const queryId = query.get('id')
  const studentId = paramId || queryId

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [paymentForm, setPaymentForm] = useState({ amount: '', transactionId: '', screenshot: null })
  const [paymentLoading, setPaymentLoading] = useState(false)

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

        if (aRes.data && aRes.data.success) setAttendance(aRes.data.records || [])
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

  const handlePaymentChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'screenshot') {
      setPaymentForm(prev => ({ ...prev, screenshot: files[0] }))
    } else {
      setPaymentForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    
    if (!studentId) {
      alert('Student ID not found. Please log in again.')
      navigate('/student/login')
      return
    }
    
    if (!paymentForm.amount || !paymentForm.transactionId) {
      alert('Please fill all required fields')
      return
    } 

    setPaymentLoading(true)
    try {
      const paymentData = {
        studentId,
        amount: parseFloat(paymentForm.amount),
        transactionId: paymentForm.transactionId
      }

      const res = await api.put('/student/uploadPayment', paymentData)

      if (res.data && res.data.message) {
        alert('Payment uploaded successfully. Waiting for admin approval.')
        setPaymentForm({ amount: '', transactionId: '', screenshot: null })
        // Refresh profile to update payment history
        const pRes = await api.get(`/student/profile/${studentId}`)
        if (pRes.data && pRes.data.success) setProfile(pRes.data.student)
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Error uploading payment')
    } finally {
      setPaymentLoading(false)
    }
  }

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
                            <td className='py-3'>{rec.subject?.name || '-'}</td>
                            <td className='py-3'><span className={rec.status === 'Present' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{rec.status || 'Absent'}</span></td>
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
                <h2 className='text-2xl font-bold mb-6'>Fees & Payments</h2>
                
                {/* Fee Summary */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                  <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                    <p className='text-sm text-gray-600'>Total Fees</p>
                    <p className='text-3xl font-bold text-blue-600'>₹{profile?.totalfees ?? 0}</p>
                  </div>
                  <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                    <p className='text-sm text-gray-600'>Paid</p>
                    <p className='text-3xl font-bold text-green-600'>₹{profile?.paidfees ?? 0}</p>
                  </div>
                  <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
                    <p className='text-sm text-gray-600'>Due</p>
                    <p className='text-3xl font-bold text-red-600'>₹{(profile?.totalfees ?? 0) - (profile?.paidfees ?? 0)}</p>
                  </div>
                </div>

                {/* Payment Form */}
                <div className='bg-white border rounded-lg p-6 mb-6'>
                  <h3 className='text-lg font-semibold mb-4 text-gray-700'>Upload Payment</h3>
                  <form onSubmit={handlePaymentSubmit} className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Amount *</label>
                        <input
                          type='number'
                          name='amount'
                          value={paymentForm.amount}
                          onChange={handlePaymentChange}
                          placeholder='Enter amount'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Transaction ID *</label>
                        <input
                          type='text'
                          name='transactionId'
                          value={paymentForm.transactionId}
                          onChange={handlePaymentChange}
                          placeholder='e.g., UPI/Bank Ref'
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Payment Receipt/Screenshot</label>
                      <input
                        type='file'
                        name='screenshot'
                        onChange={handlePaymentChange}
                        accept='image/*'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      {paymentForm.screenshot && <p className='text-sm text-green-600 mt-1'>✓ {paymentForm.screenshot.name}</p>}
                    </div>
                    <button
                      type='submit'
                      disabled={paymentLoading}
                      className='w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50'
                    >
                      {paymentLoading ? 'Uploading...' : 'Upload Payment'}
                    </button>
                  </form>
                </div>

                {/* Payment History */}
                <div className='bg-white border rounded-lg p-6'>
                  <h3 className='text-lg font-semibold mb-4 text-gray-700'>Payment History</h3>
                  <div className='space-y-3 max-h-96 overflow-y-auto'>
                    {(profile?.payments && profile.payments.length > 0) ? (
                      profile.payments.map((p, idx) => (
                        <div key={idx} className='p-3 bg-gray-50 border rounded-md flex justify-between items-start'>
                          <div>
                            <div className='font-semibold text-gray-800'>₹{p.amount}</div>
                            <div className='text-xs text-gray-600 mt-1'>
                              <p>TxID: {p.transactionId || 'N/A'}</p>
                              <p>Method: {p.paymentMethod || 'Online'}</p>
                              <p>Date: {formatDate(p.paidAt || p.date)}</p>
                            </div>
                          </div>
                          <div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              p.status === 'approved' ? 'bg-green-100 text-green-700' :
                              p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {p.status?.toUpperCase() || 'PENDING'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className='text-gray-600 text-center py-8'>No payment history yet.</p>
                    )}
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