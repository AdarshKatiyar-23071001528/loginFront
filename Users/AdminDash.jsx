import React, { useState, useContext } from "react";
import { IoMdMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaHome, FaMoneyBillAlt } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { FaUserGear } from "react-icons/fa6";
import { FcMoneyTransfer } from "react-icons/fc";
import AppContext from "../src/Context/AppContext";
import axios from "axios";
import StudentRegister from "../src/Student/StudentRegister";

const AdminDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectStudent, setSelectStudent] = useState(false);
  const [activePage, setActivePage] = useState("home");

  // const { studentRegister } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    wrn: "",
    enrollment: "",
    course: "",
    fathername: "",
    mothername: "",
    mobile1: "",
    mobile2: "",
    mobile3: "",
    dob: "",
    doa: "",
    adhaar: "",
    address: "",
    pincode: "",
    post: "",
    district: "",
    landmark: "",
    rollno: "",
    email: "",
    password: "",
    totalfees: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/student", formData);
      alert("Student Added Successfully ✅");
      setFormData({
        name: "",
        wrn: "",
        enrollment: "",
        course: "",
        fathername: "",
        mothername: "",
        mobile1: "",
        mobile2: "",
        mobile3: "",
        dob: "",
        doa: "",
        adhaar: "",
        address: "",
        pincode: "",
        post: "",
        district: "",
        landmark: "",
        rollno: "",
        email: "",
        password: "",
        totalfees: "",
      });
    } catch (error) {
      alert("Error adding student ❌");
    }
  };

  return (
    <>
     {/* Top Navbar */}
        <div className="h-[70px] shadow flex justify-between items-center px-4 ">
          <div>{!sidebarOpen && (
            <IoMdMenu
              size={25}
              className="cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            />
          )}</div>
          
          <h1 className="ml-4 text-xl font-semibold">Admin Dashboard</h1>
        </div>

    <div className="h-screen flex overflow-hidden">

    
      {/* ================= Sidebar ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-[#1B1B1B] text-white p-4 flex flex-col gap-4 transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="text-xl font-bold mb-6 flex justify-between items-center">
          Admin Panel
          <RxCross2
            size={22}
            className="cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        <ul className="flex flex-col gap-4">
          <li
            className={`flex items-center gap-2 cursor-pointer p-2 rounded ${
              activePage === "home" ? "bg-gray-700" : ""
            }`}
            onClick={() => setActivePage("home")}
          >
            <FaHome /> Home
          </li>

          <li>
            <div
              className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-700"
              onClick={() => setSelectStudent(!selectStudent)}
            >
              <PiStudent /> Student
            </div>

            {selectStudent && (
              <ul className="pl-6 mt-2 flex flex-col gap-2 text-sm">
                <li
                  className={`cursor-pointer hover:text-yellow-400 ${
                    activePage === "all" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => setActivePage("all")}
                >
                  All Student
                </li>
                <li
                  className={`cursor-pointer hover:text-yellow-400 ${
                    activePage === "add" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => setActivePage("add")}
                >
                  Add Student
                </li>
                <li
                  className={`cursor-pointer hover:text-yellow-400 ${
                    activePage === "update" ? "text-yellow-400" : ""
                  }`}
                  onClick={() => setActivePage("update")}
                >
                  Update Student
                </li>
              </ul>
            )}
          </li>

          <li
            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-700 rounded"
            onClick={() => setActivePage("fees")}
          >
            <FaMoneyBillAlt /> Fees
          </li>

          <li
            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-700 rounded"
            onClick={() => setActivePage("staff")}
          >
            <FaUserGear /> Staff
          </li>

          <li
            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-700 rounded"
            onClick={() => setActivePage("expense")}
          >
            <FcMoneyTransfer /> Expense
          </li>
        </ul>
      </div>

      {/* ================= Right Side Content ================= */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${sidebarOpen ? "ml-[20px]" : "ml-0"}`}
      >
       

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {activePage === "home" && (
            <h2 className="text-2xl font-bold">Welcome to Dashboard</h2>
          )}

          {activePage === "all" && (
            <h2 className="text-2xl font-bold">All Students Page</h2>
          )}

          {activePage === "add" && (
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
                Add New Student
              </h2>

              <StudentRegister/>
            </div>
          )}

          {activePage === "update" && (
            <h2 className="text-2xl font-bold">Update Student Page</h2>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDash;