import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { FaEye, FaTimes } from 'react-icons/fa'

const StudentNotice = ({forWhich}) => {
  const [filterData, setFilterData] = useState([]);
  const [all, setALL] = useState([]);
  const [modalData, setModalData] = useState(null);
  

  useEffect(() => {
    const result = async () => {
      const allNotice = await api.get('/notice/all');
      setALL(allNotice?.data?.result);
    }
    result();
  }, [])

  useEffect(() => {
    const forStudent = () => {
      const res = all
        .filter((stu) => !forWhich || stu.isFor === forWhich || stu.isFor === "all")
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // latest first
      setFilterData(res);
    }
    forStudent();
  }, [all])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col">
  

      {/* Scrollable container */}
      <div className="overflow-y-auto max-h-[75vh] grid gap-4 md:grid-cols-2 lg:grid-cols-3 pr-2">
        {filterData.map((notice, index) => (
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

            {/* View Button */}
            <button
              onClick={() => setModalData(notice)}
              className="absolute top-5 right-5 text-blue-600 hover:text-blue-800"
              title="View Notice"
            >
              <FaEye size={18} />
            </button>
          </div>
        ))}
      </div>

      {filterData.length === 0 && (
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
  )
}

export default StudentNotice