import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { FaHome } from "react-icons/fa";

import Login from "./Login";
import StudentLogin from "../src/Student/StudentLogin";
import TeacherLogin from "../src/Teacher/TeacherLogin";
import logo from "../src/assest/logo.png";

const roles = [
  { key: "admin", label: "Admin", icon: MdAdminPanelSettings },
  { key: "teacher", label: "Faculty", icon: GiTeacher },
  { key: "student", label: "Student", icon: PiStudentBold },
];

const MultiLogin = () => {
  const [role, setRole] = useState("admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-900 pt-8">
      <div className="ui-container">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/90 ring-1 ring-inset ring-white/15 transition hover:bg-white/15"
        >
          <FaHome /> Home
        </Link>

        <div className="mt-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <div className="ui-card border-white/10 bg-white/5 p-8 text-white ring-1 ring-inset ring-white/10">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SKIT" className="h-14 w-auto opacity-95" />
              <div>
                <div className="text-lg font-semibold tracking-tight">Login Portal</div>
                <div className="text-sm text-white/70">Shakuntala Krishna Institute of Technology</div>
              </div>
            </div>

            <div className="mt-8 space-y-3 text-white/80">
              <p className="text-3xl font-semibold tracking-tight text-white">Welcome back</p>
              <p className="text-sm leading-6">
                Select your role and sign in to continue. If you’re new, start with registration from the home page.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {roles.map(({ key, label, icon: Icon }) => {
                const active = role === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRole(key)}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ring-1 ring-inset transition ${
                      active ? "bg-white/15 text-white ring-white/25" : "bg-white/5 text-white/80 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="text-xl" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ui-card p-6 sm:p-8">
            {role === "admin" ? <Login /> : null}
            {role === "teacher" ? <TeacherLogin /> : null}
            {role === "student" ? <StudentLogin /> : null}

            <div className="mt-6 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-600">
                Having trouble?{" "}
                <Link to="/contact" className="font-semibold text-indigo-700 hover:text-indigo-800">
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="py-10 text-center text-xs text-white/60">© 2026 SKIT. All rights reserved.</div>
      </div>
    </div>
  );
};

export default MultiLogin;

