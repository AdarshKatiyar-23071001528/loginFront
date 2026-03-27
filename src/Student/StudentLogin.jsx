import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import AppContext from "../Context/AppContext";

const StudentLogin = () => {
  const navigate = useNavigate();
  const { studentLogin } = useContext(AppContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setloading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setloading(true);
    const result = await studentLogin(formData.email, formData.password);
    if (result.success) {
      navigate(`/student/dash?id=${result.student._id}`);
      setloading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="w-full space-y-4">
      <div className="text-center">
        <div className="text-xl font-semibold text-slate-900">Student</div>
        <div className="mt-1 text-sm text-slate-600">Sign in to continue</div>
      </div>

      <div>
        <label className="ui-label" htmlFor="student-email">
          Email
        </label>
        <div className="relative mt-2">
          <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="student-email"
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            type="email"
            className="ui-input pl-10"
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div>
        <label className="ui-label" htmlFor="student-password">
          Password
        </label>
        <div className="relative mt-2">
          <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="student-password"
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
            type="password"
            className="ui-input pl-10"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="ui-btn ui-btn-primary w-full justify-center py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Signing in ... " : "Sign in"}
      </button>
    </form>
  );
};

export default StudentLogin;

