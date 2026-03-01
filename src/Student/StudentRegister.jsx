import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

const StudentRegister = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollno: '',
    enrollment: '',
    wrn: '',
    course: '',
    semester: '',
    section: 'A',
    fathername: '',
    mothername: '',
    mobile1: '',
    mobile2: '',
    mobile3: '',
    dob: '',
    doa: '',
    adhaar: '',
    address: '',
    pincode: '',
    post: '',
    district: '',
    landmark: '',
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
    if (!formData.rollno.trim()) {
      setMessage('Roll Number is required')
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
    if (!formData.enrollment.trim()) {
      setMessage('Enrollment Number is required')
      setMessageType('error')
      return false
    }
    if (!formData.mobile1.trim()) {
      setMessage('Mobile number is required')
      setMessageType('error')
      return false
    }
    if (!/^\d{10}$/.test(formData.mobile1)) {
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
      const response = await api.post('/student/register', {
        name: formData.name,
        rollno: formData.rollno,
        email: formData.email,
        password: formData.password,
        enrollment: formData.enrollment,
        wrn: formData.wrn,
        course: formData.course,
        semester: formData.semester ? parseInt(formData.semester) : undefined,
        section: formData.section,
        fathername: formData.fathername,
        mothername: formData.mothername,
        mobile1: parseInt(formData.mobile1),
        mobile2: formData.mobile2 ? parseInt(formData.mobile2) : undefined,
        mobile3: formData.mobile3 ? parseInt(formData.mobile3) : undefined,
        dob: formData.dob || undefined,
        doa: formData.doa || undefined,
        adhaar: formData.adhaar ? parseInt(formData.adhaar) : undefined,
        address: formData.address,
        pincode: formData.pincode ? parseInt(formData.pincode) : undefined,
        post: formData.post,
        district: formData.district,
        landmark: formData.landmark,
      })

      if (response.data.success) {
        setMessage('🎉 Registration Successful! Redirecting to login...')
        setMessageType('success')
        setFormData({
          name: '',
          email: '',
          password: '',
          rollno: '',
          enrollment: '',
          wrn: '',
          course: '',
          semester: '',
          section: 'A',
          fathername: '',
          mothername: '',
          mobile1: '',
          mobile2: '',
          mobile3: '',
          dob: '',
          doa: '',
          adhaar: '',
          address: '',
          pincode: '',
          post: '',
          district: '',
          landmark: '',
        })
        setTimeout(() => {
          navigate('/studentlog')
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
      ? 'border-pink-500 shadow-lg shadow-pink-200 bg-pink-50' 
      : 'border-gray-300 hover:border-gray-400 bg-white'
    }
    text-gray-700 font-medium placeholder-gray-400
  `

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-600 via-rose-600 to-orange-500 py-12 px-4 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2'></div>

      <div className='max-w-4xl mx-auto relative z-10'>
        {/* Header */}
        <div className='text-center mb-10'>
          <div className='inline-block p-4 bg-white/20 backdrop-blur-lg rounded-full mb-4 border border-white/30'>
            <svg className='w-12 h-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.692 10-10.747S17.5 6.253 12 6.253z' />
            </svg>
          </div>
          <h1 className='text-5xl font-bold text-white mb-3 drop-shadow-lg'>Student Registration</h1>
          <p className='text-white/90 text-lg font-medium drop-shadow'>Enroll now and start your learning journey</p>
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
            <div className='bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-100'>
              <h3 className='text-lg font-bold text-pink-900 mb-5 flex items-center gap-2'>
                <span className='w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm'>*</span>
                Essential Information
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
                {/* Name */}
                <div>
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

                {/* Roll Number */}
                <div>
                  <label className='block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide'>Roll Number</label>
                  <input
                    type='text'
                    name='rollno'
                    value={formData.rollno}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('rollno')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('rollno')}
                    placeholder='E.g., 001'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
                {/* Email */}
                <div>
                  <label className='block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide'>Email Address</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('email')}
                    placeholder='E.g., student@example.com'
                    required
                  />
                </div>

                {/* Password */}
                <div>
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
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {/* Enrollment Number */}
                <div>
                  <label className='block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide'>Enrollment Number</label>
                  <input
                    type='text'
                    name='enrollment'
                    value={formData.enrollment}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('enrollment')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('enrollment')}
                    placeholder='Enrollment number'
                    required
                  />
                </div>

                {/* Mobile 1 */}
                <div>
                  <label className='block text-gray-800 font-bold mb-3 text-sm uppercase tracking-wide'>Mobile Number</label>
                  <input
                    type='tel'
                    name='mobile1'
                    value={formData.mobile1}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('mobile1')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('mobile1')}
                    placeholder='10-digit mobile number'
                    maxLength='10'
                    required
                  />
                </div>
              </div>
            </div>

            {/* Academic Details Section */}
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100'>
              <h3 className='text-lg font-bold text-blue-900 mb-5'>Academic Details</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
                {/* Course */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Course</label>
                  <input
                    type='text'
                    name='course'
                    value={formData.course}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('course')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('course')}
                    placeholder='E.g., B.Tech, B.Sc'
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Semester</label>
                  <select
                    name='semester'
                    value={formData.semester}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('semester')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('semester')}
                  >
                    <option value=''>Select Semester</option>
                    <option value='1'>1st Semester</option>
                    <option value='2'>2nd Semester</option>
                    <option value='3'>3rd Semester</option>
                    <option value='4'>4th Semester</option>
                    <option value='5'>5th Semester</option>
                    <option value='6'>6th Semester</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {/* Section */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Section</label>
                  <select
                    name='section'
                    value={formData.section}
                    onChange={handleChange}
                    className={inputClasses('section')}
                  >
                    <option value='A'>Section A</option>
                    <option value='B'>Section B</option>
                    <option value='C'>Section C</option>
                    <option value='D'>Section D</option>
                  </select>
                </div>

                {/* WRN */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>WRN</label>
                  <input
                    type='text'
                    name='wrn'
                    value={formData.wrn}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('wrn')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('wrn')}
                    placeholder='Unique identifier'
                  />
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div className='bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100'>
              <h3 className='text-lg font-bold text-purple-900 mb-5'>Personal Details</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
                {/* Father Name */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Father's Name</label>
                  <input
                    type='text'
                    name='fathername'
                    value={formData.fathername}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('fathername')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('fathername')}
                    placeholder='Father name'
                  />
                </div>

                {/* Mother Name */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Mother's Name</label>
                  <input
                    type='text'
                    name='mothername'
                    value={formData.mothername}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('mothername')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('mothername')}
                    placeholder='Mother name'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
                {/* Date of Birth */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Date of Birth</label>
                  <input
                    type='date'
                    name='dob'
                    value={formData.dob}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('dob')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('dob')}
                  />
                </div>

                {/* Date of Admission */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Date of Admission</label>
                  <input
                    type='date'
                    name='doa'
                    value={formData.doa}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('doa')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('doa')}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {/* Aadhar */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Aadhar Number</label>
                  <input
                    type='number'
                    name='adhaar'
                    value={formData.adhaar}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('adhaar')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('adhaar')}
                    placeholder='12-digit Aadhar number'
                  />
                </div>

                {/* Alternative Mobile */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Alternative Mobile 1</label>
                  <input
                    type='tel'
                    name='mobile2'
                    value={formData.mobile2}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('mobile2')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('mobile2')}
                    placeholder='Optional'
                    maxLength='10'
                  />
                </div>
              </div>

              <div className='mt-5'>
                <label className='block text-gray-800 font-semibold mb-2 text-sm'>Alternative Mobile 2</label>
                <input
                  type='tel'
                  name='mobile3'
                  value={formData.mobile3}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('mobile3')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses('mobile3')}
                  placeholder='Optional'
                  maxLength='10'
                />
              </div>
            </div>

            {/* Address Section */}
            <div className='bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100'>
              <h3 className='text-lg font-bold text-green-900 mb-5'>Address Details</h3>

              <div className='mb-5'>
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

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
                {/* Pincode */}
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

                {/* Post */}
                <div>
                  <label className='block text-gray-800 font-semibold mb-2 text-sm'>Post</label>
                  <input
                    type='text'
                    name='post'
                    value={formData.post}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('post')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses('post')}
                    placeholder='Post name'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {/* District */}
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

                {/* Landmark */}
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
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 transform ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95'
              }`}
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin'></div>
                  Registering...
                </div>
              ) : (
                '✓ Register as Student'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-8 pt-8 border-t border-gray-200'>
            <p className='text-center text-gray-700 font-medium'>
              Already have an account?{' '}
              <a href='/studentlog' className='text-pink-600 font-bold hover:text-pink-700 hover:underline transition-all'>
                Login here
              </a>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className='text-center mt-8 text-white/80 text-sm'>
          <p>© 2026 Student Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default StudentRegister
//                                 </div>

//                                 <a href="#" class="forgot">Forgot Password?</a>

//                                 <button type="submit">Register</button>

//                                 <p class="signup-text">
//                                     Already have an account? <a href="/">Login</a>
//                                 </p>



//                             </form>
//                         </div>

//                         <div class="right">
//                             <h1>Welcome to <span>SKIT</span></h1>
//                             <p class="tagline">Dreams Come True Here!</p>


//                             <img src="./s1.jpg"
//                                 alt="Student Login Illustration"
//                                 class="illustration" />
//                         </div>

//                     </div>
//                 </div>
//             </div>
            
//         </>
//     )
// }

// export default studentRegister