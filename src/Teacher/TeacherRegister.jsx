import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

const TeacherRegister = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    pincode: '',
    post: '',
    district: '',
    landmark: '',
    destination: '',
    salary: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage('Full Name is required')
      setMessageType('error')
      return false
    }
    if (!formData.email.trim()) {
      setMessage('Email is required')
      setMessageType('error')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage('Please enter a valid email')
      setMessageType('error')
      return false
    }
    if (!formData.password.trim()) {
      setMessage('Password is required')
      setMessageType('error')
      return false
    }
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters')
      setMessageType('error')
      return false
    }
    if (!formData.mobile.trim()) {
      setMessage('Mobile number is required')
      setMessageType('error')
      return false
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      setMessage('Please enter a valid 10-digit mobile number')
      setMessageType('error')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/teacher/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: parseInt(formData.mobile),
        address: formData.address,
        pincode: formData.pincode ? parseInt(formData.pincode) : undefined,
        post: formData.post,
        district: formData.district,
        landmark: formData.landmark,
        destination: formData.destination,
        salary: formData.salary ? parseInt(formData.salary) : undefined,
      })

      if (response.data.success) {
        setMessage('🎉 Registration Successful! Redirecting to login...')
        setMessageType('success')
        setFormData({
          name: '',
          email: '',
          password: '',
          mobile: '',
          address: '',
          pincode: '',
          post: '',
          district: '',
          landmark: '',
          destination: '',
          salary: '',
        })
        setTimeout(() => {
          navigate('/teacherlog')
        }, 2000)
      } else {
        setMessage(response.data.message || 'Registration failed')
        setMessageType('error')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred during registration')
      setMessageType('error')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = (name) => `
    w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300
    ${focusedField === name 
      ? 'border-blue-500 shadow-lg shadow-blue-200 bg-blue-50' 
      : 'border-gray-300 hover:border-gray-400 bg-white'
    }
    text-gray-700 font-medium placeholder-gray-400
  `

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2'></div>

      <div className='max-w-3xl mx-auto relative z-10'>
        {/* Header */}
        <div className='text-center mb-10'>
          <div className='inline-block p-4 bg-white/20 backdrop-blur-lg rounded-full mb-4 border border-white/30'>
            <svg className='w-12 h-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' />
            </svg>
          </div>
          <h1 className='text-5xl font-bold text-white mb-3 drop-shadow-lg'>Teacher Registration</h1>
          <p className='text-white/90 text-lg font-medium drop-shadow'>Join our team and inspire the next generation</p>
        </div>

        {/* Main Card */}
        <div className='bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20'>
          {/* Alert Message */}
          {message && (
            <div className={`mb-8 p-4 rounded-xl backdrop-blur-sm border-2 transition-all duration-300 ${
              messageType === 'success' 
                ? 'bg-green-50/80 border-green-400 text-green-700 shadow-lg shadow-green-100' 
                : 'bg-red-50/80 border-red-400 text-red-700 shadow-lg shadow-red-100'
            }`}>
              <div className='flex items-center gap-2'>
                <span className='text-xl'>{messageType === 'success' ? '✓' : '!'}</span>
                <span className='font-semibold'>{message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Essential Fields Section */}
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100'>
              <h3 className='text-lg font-bold text-blue-900 mb-5 flex items-center gap-2'>
                <span className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm'>*</span>
                Essential Information
              </h3>

              {/* Name */}
              <div className='mb-5'>
                <label className='block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide'>Full Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses('name')}
                  placeholder='E.g., John Doe'
                  required
                />
              </div>

              {/* Email */}
              <div className='mb-5'>
                <label className='block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide'>Email Address</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses('email')}
                  placeholder='E.g., teacher@example.com'
                  required
                />
              </div>

              {/* Password */}
              <div className='mb-5'>
                <label className='block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide'>Password</label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses('password')}
                  placeholder='Minimum 6 characters'
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className='block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide'>Mobile Number</label>
                <input
                  type='tel'
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('mobile')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses('mobile')}
                  placeholder='10-digit mobile number'
                  maxLength='10'
                  required
                />
              </div>
            </div>

            {/* Address Section */}
            <div className='bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100'>
              <h3 className='text-lg font-bold text-purple-900 mb-5'>Address Details</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Address</label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('address')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('address')}
                    placeholder='Street address'
                  />
                </div>

                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Pincode</label>
                  <input
                    type='number'
                    name='pincode'
                    value={formData.pincode}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('pincode')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('pincode')}
                    placeholder='Postal code'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Landmark</label>
                  <input
                    type='text'
                    name='landmark'
                    value={formData.landmark}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('landmark')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('landmark')}
                    placeholder='Nearby landmark'
                  />
                </div>

                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>District</label>
                  <input
                    type='text'
                    name='district'
                    value={formData.district}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('district')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('district')}
                    placeholder='District name'
                  />
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div className='bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100'>
              <h3 className='text-lg font-bold text-green-900 mb-5'>Professional Details</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Post/Designation</label>
                  <input
                    type='text'
                    name='post'
                    value={formData.post}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('post')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('post')}
                    placeholder='E.g., Senior Teacher'
                  />
                </div>

                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Subject/Specialization</label>
                  <input
                    type='text'
                    name='destination'
                    value={formData.destination}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('destination')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('destination')}
                    placeholder='E.g., Mathematics'
                  />
                </div>
              </div>

              <div>
                <label className='block text-gray-800 font-semibold mb-2 text-sm'>Salary</label>
                <input
                  type='number'
                  name='salary'
                  value={formData.salary}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('salary')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses('salary')}
                  placeholder='Annual salary (optional)'
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 transform ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95'
              }`}
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin'></div>
                  Registering...
                </div>
              ) : (
                '✓ Register as Teacher'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-8 pt-8 border-t border-gray-200'>
            <p className='text-center text-gray-700 font-medium'>
              Already have an account?{' '}
              <a href='/teacherlog' className='text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all'>
                Login here
              </a>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className='text-center mt-8 text-white/80 text-sm'>
          <p>© 2026 Teacher Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default TeacherRegister
