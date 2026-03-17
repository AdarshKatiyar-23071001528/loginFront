import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../src/Context/AppContext";
import logo from "../src/assest/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="ui-container">
        <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-900 p-10 text-white lg:block">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SKIT" className="h-12 w-auto opacity-95" />
              <div>
                <div className="text-lg font-semibold">SKIT</div>
                <div className="text-sm text-white/75">Create a new account</div>
              </div>
            </div>

            <div className="mt-10 space-y-3 text-white/80">
              <p className="text-2xl font-semibold tracking-tight text-white">Welcome!</p>
              <p className="text-sm leading-6">
                Register to access the portal. You can log in after successful registration.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Register</h1>
                <p className="ui-muted mt-1">Enter your details to create an account.</p>
              </div>
              <Link to="/login" className="ui-btn ui-btn-secondary">
                Login
              </Link>
            </div>

            <form onSubmit={submitHandler} className="mt-8 space-y-5">
              <div>
                <label className="ui-label" htmlFor="name">
                  Full name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChangeHandler}
                    type="text"
                    className="ui-input"
                    placeholder="Enter your name"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="ui-label" htmlFor="email">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChangeHandler}
                    type="email"
                    className="ui-input"
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="ui-label" htmlFor="password">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onChangeHandler}
                    type="password"
                    className="ui-input"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="ui-btn ui-btn-primary w-full justify-center py-2.5">
                Create account
              </button>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-700 hover:text-indigo-800">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

