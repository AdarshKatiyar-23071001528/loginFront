import React, { useState } from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import Login from "./Login";
import StudentLogin from "../src/Student/StudentLogin";
import TeacherLogin from "../src/Teacher/TeacherLogin";

const MultiLogin = () => {
  const [role, setRole] = useState("admin");
  return (
    <>
      <div className="h-full w-full flex justify-center items-center bg-gray-300 mt-20 ">
        <div
          className={`h-[65%] md:h-[70%] w-[70%] md:w-[40%] bg-white rounded-lg shadow-lg p-2 border-l-12 ${role === "admin" ? "border-blue-500" : role === "teacher" ? "border-green-500" : role === "student" ? "border-yellow-500" : ""}`}
        >
          <div className="choose flex flex-row md:flex-row justify-around items-center h-20 w-full  rounded-lg ">
            <MdAdminPanelSettings
              size={70}
              onClick={() => setRole("admin")}
              title="admin"
              className={`cursor-pointer hover:border-2 rounded-full p-2 ${role === "admin" ? "border-2 border-blue-500" : ""}`}
            />
            <GiTeacher
              size={70}
              onClick={() => setRole("teacher")}
              title="teacher"
              className={`cursor-pointer hover:border-2 rounded-full p-2 ${role === "teacher" ? "border-2 border-green-500" : ""}`}
            />
            <PiStudentBold
              size={70}
              onClick={() => setRole("student")}
              title="student"
              className={`cursor-pointer hover:border-2 rounded-full p-2 ${role === "student" ? "border-2 border-yellow-500" : ""}`}
            />
          </div>
          <div className="logBox h-[70%] w-full flex flex-col justify-center items-center  mt-4 overflow-hidden">
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
