import React from 'react'
import { FaGraduationCap, FaUsers, FaBriefcase, FaAward, FaChalkboardUser, FaBook, FaStar, FaArrowRight } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  return ( <>

     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black  mb-10 md:mb-8 leading-tight tracking-tight">
            Welcome to <span className="bg-clip-text text-grey-400 ">SKIT</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Your gateway to world-class education. Learn from industry experts, build real-world skills, and accelerate your career.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/student/login')}
              className="w-full sm:w-auto px-5 sm:px-10 py-3 sm:py-4 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transform hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl text-base sm:text-lg p-2 rounded"
            >
              Student Login
            </button>
            <button 
              onClick={() => navigate('/faculty/login')}
              className="w-full sm:w-auto px-5 sm:px-10 py-3 sm:py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl text-base sm:text-lg"
            >
              Faculty Login
            </button>
          </div> */}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 py-16 md:py-24 px-4 sm:px-6 lg:px-">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-md hover:shadow-2xl transition duration-300 border-t-4 border-blue-500">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-3 font-black">5000+</div>
              <p className="text-gray-700 text-base md:text-lg font-semibold">Students Enrolled</p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-md hover:shadow-2xl transition duration-300 border-t-4 border-purple-500">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 mb-3 font-black">200+</div>
              <p className="text-gray-700 text-base md:text-lg font-semibold">Expert Faculty</p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-md hover:shadow-2xl transition duration-300 border-t-4 border-pink-500">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-600 mb-3 font-black">50+</div>
              <p className="text-gray-700 text-base md:text-lg font-semibold">Courses</p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-md hover:shadow-2xl transition duration-300 border-t-4 border-green-500">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600 mb-3 font-black">95%</div>
              <p className="text-gray-700 text-base md:text-lg font-semibold">Placement Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 md:py-32 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6">Why Choose SKIT?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 md:p-10 rounded-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2">
              <div className="text-5xl md:text-6xl text-blue-600 mb-6"><FaChalkboardUser /></div>
              <h3 className="text-2xl md:text-2xl font-bold text-slate-900 mb-4">Expert Faculty</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">Learn from industry veterans with 15+ years of experience in their respective domains.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 md:p-10 rounded-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2">
              <div className="text-5xl md:text-6xl text-purple-600 mb-6"><FaBook /></div>
              <h3 className="text-2xl md:text-2xl font-bold text-slate-900 mb-4">Modern Curriculum</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">Updated courses aligned with industry standards and emerging technologies.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 md:p-10 rounded-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2">
              <div className="text-5xl md:text-6xl text-pink-600 mb-6"><FaBriefcase /></div>
              <h3 className="text-2xl md:text-2xl font-bold text-slate-900 mb-4">Career Support</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">Dedicated placement team connecting students with top companies worldwide.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 md:p-10 rounded-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2">
              <div className="text-5xl md:text-6xl text-green-600 mb-6"><FaAward /></div>
              <h3 className="text-2xl md:text-2xl font-bold text-slate-900 mb-4">Certifications</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">Internationally recognized credentials to enhance your professional profile.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 md:p-10 rounded-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2">
              <div className="text-5xl md:text-6xl text-yellow-600 mb-6"><FaUsers /></div>
              <h3 className="text-2xl md:text-2xl font-bold text-slate-900 mb-4">Vibrant Community</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">Network with like-minded professionals and build lasting connections.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 md:p-10 rounded-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2">
              <div className="text-5xl md:text-6xl text-red-600 mb-6"><FaGraduationCap /></div>
              <h3 className="text-2xl md:text-2xl font-bold text-slate-900 mb-4">Global Recognition</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">Degrees valued and recognized by employers across the globe.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Preview Section */}
      <div className="py-20 md:py-32 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4">Popular Courses</h2>
            <p className="text-gray-700 text-base md:text-lg font-medium max-w-2xl mx-auto">Explore our comprehensive range of courses across various domains</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Computer Science & IT', subjects: '12 Subjects', color: 'from-blue-400 to-blue-600' },
              { title: 'Business Administration', subjects: '10 Subjects', color: 'from-purple-400 to-purple-600' },
              { title: 'Engineering', subjects: '15 Subjects', color: 'from-pink-400 to-pink-600' },
              { title: 'Arts & Sciences', subjects: '20 Subjects', color: 'from-green-400 to-green-600' },
              { title: 'Commerce', subjects: '8 Subjects', color: 'from-yellow-400 to-yellow-600' },
              { title: 'Management', subjects: '9 Subjects', color: 'from-red-400 to-red-600' }
            ].map((course, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${course.color} p-8 md:p-10 rounded-xl text-white hover:shadow-2xl transition duration-300 transform hover:scale-105 cursor-pointer`}>
                <h3 className="text-xl md:text-2xl font-bold mb-3">{course.title}</h3>
                <p className="mb-8 text-white text-opacity-90 font-medium">{course.subjects}</p>
                <button className="w-full bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300">
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 md:py-32 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4">Student Success Stories</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              { name: 'Rajesh Kumar', role: 'Software Engineer at Google', quote: 'Excellence Academy transformed my career. The faculty and curriculum helped me land my dream job.' },
              { name: 'Priya Singh', role: 'Product Manager at Microsoft', quote: 'The practical exposure and mentorship I received was invaluable for professional growth.' },
              { name: 'Arjun Patel', role: 'Startup Founder', quote: 'The entrepreneurship program gave me confidence to start my own successful venture.' }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-slate-50 p-8 md:p-10 rounded-xl shadow-md hover:shadow-2xl transition duration-300 border-l-4 border-blue-500">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed mb-6">"{testimonial.quote}"</p>
                <div className="text-yellow-400 text-lg">★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 md:py-28 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 md:mb-8">Ready to Transform Your Future?</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-10 md:mb-12 font-light leading-relaxed">Start your learning journey today and unlock unlimited opportunities for success and growth.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/student/register')}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transform hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl text-base sm:text-lg"
            >
              Register as Student
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl text-base sm:text-lg"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Footer Features */}
      <div className="bg-slate-900 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black text-blue-400 mb-3">24/7</div>
              <p className="text-gray-300 font-medium text-base md:text-lg">Online Learning Platform</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-purple-400 mb-3">100%</div>
              <p className="text-gray-300 font-medium text-base md:text-lg">Flexible Schedule</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-pink-400 mb-3">∞</div>
              <p className="text-gray-300 font-medium text-base md:text-lg">Lifetime Access</p>
            </div>
          </div>
        </div>
      </div>
    
  </>)
}

export default Home
