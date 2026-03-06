import React, { useState } from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import Login from "./Login";
import StudentLogin from "../src/Student/StudentLogin";
import TeacherLogin from "../src/Teacher/TeacherLogin";
import logo from "../src/assest/logo.png"
import { FaHome } from "react-icons/fa";
import { GoMoveToStart } from "react-icons/go";

const MultiLogin = () => {
  const [role, setRole] = useState("admin");  
  return (
    <>
  
      <div className="h-full w-full flex justify-end items-center bg-gray-300 mt-20 p-4">
       <Link to={"/"} className="absolute top-2 left-2 border border-black px-4 py-2 rounded flex items-center gap-2 opacity-50 hover:opacity-100 transition duration-300 text-decoration-none font-black text-black">
  <FaHome /> Home
</Link>
        <div className="w-[30%] md:w-[70%] h-[50%] md:h-[70%] flex flex-col justify-center items-center">
          <img src={logo} alt="" className="h-[150px] mb-3 opacity-75" />
          <p className="text-6xl font-bold text-gray-800 mb-4 font-bold">Welcome to the Login Portal</p>
          <h2 className="">Shakuntala Krishna Institute of Technology</h2>
          <p className="text-gray-800 text-xl">Bahablapur, Kanpur Dehat</p>

        </div>
        <div
          className={`h-[50%] md:h-[70%] w-[70%] md:w-[30%] rounded-lg shadow-lg p-2 flex flex-col items-center  border-2 border-l-12 ${role === "admin" ? "border-blue-500" : role === "teacher" ? "border-green-500" : role === "student" ? "border-yellow-500" : ""}`}
        >
          <div className="choose flex flex-row md:flex-row justify-around items-center h-20 w-[200px]  rounded-lg gap-2">
            <MdAdminPanelSettings
              size={50}
              onClick={() => setRole("admin")}
              title="admin"
              className={`cursor-pointer hover:border-2 rounded-full p-2 ${role === "admin" ? "border-2 border-blue-500" : ""}`}
            />
            <GiTeacher
              size={50}
              onClick={() => setRole("teacher")}
              title="teacher"
              className={`cursor-pointer hover:border-2 rounded-full p-2 ${role === "teacher" ? "border-2 border-green-500" : ""}`}
            />
            <PiStudentBold
              size={50}
              onClick={() => setRole("student")}
              title="student"
              className={`cursor-pointer hover:border-2 rounded-full p-2 ${role === "student" ? "border-2 border-yellow-500" : ""}`}
            />
          </div>


          <div className="logBox h-[50%] w-full flex flex-col justify-center items-center  mt-4 ">
            {role === "admin" && <Login />}
            {role === "teacher" && <TeacherLogin />}
            {role === "student" && <StudentLogin />}
          </div>


        </div>
      </div>
    </>
  );
};


  
export default MultiLogin;
