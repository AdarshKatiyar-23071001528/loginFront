import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ALL_STAFF_PERMISSIONS, STAFF_PERMISSION_OPTIONS, STAFF_ROLES } from "../constants/staff";

const defaultPermissions = ["attendance.manage", "marks.manage", "subjects.read", "students.read"];

const TeacherRegister = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    pincode: "",
    post: "",
    district: "",
    landmark: "",
    destination: "",
    salary: "",
    role: "teacher",
    permissions: defaultPermissions,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      permissions:
        name === "role" && value === "admin_staff"
          ? [...ALL_STAFF_PERMISSIONS]
          : prev.permissions,
    }));
  };

  const handlePermissionChange = (permission) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: exists ? prev.permissions.filter((item) => item !== permission) : [...prev.permissions, permission],
      };
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage("Full Name is required");
      setMessageType("error");
      return false;
    }
    if (!formData.email.trim()) {
      setMessage("Email is required");
      setMessageType("error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage("Please enter a valid email");
      setMessageType("error");
      return false;
    }
    if (!formData.password.trim()) {
      setMessage("Password is required");
      setMessageType("error");
      return false;
    }
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setMessageType("error");
      return false;
    }
    if (!formData.mobile.trim()) {
      setMessage("Mobile number is required");
      setMessageType("error");
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      setMessage("Please enter a valid 10-digit mobile number");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post("/teacher/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: parseInt(formData.mobile, 10),
        address: formData.address,
        pincode: formData.pincode ? parseInt(formData.pincode, 10) : undefined,
        post: formData.post,
        district: formData.district,
        landmark: formData.landmark,
        destination: formData.destination,
        salary: formData.salary ? parseInt(formData.salary, 10) : undefined,
        role: formData.role,
        permissions: formData.permissions,
      });

      if (response.data.success) {
        setMessage("Staff account created successfully");
        setMessageType("success");
        setFormData({
          name: "",
          email: "",
          password: "",
          mobile: "",
          address: "",
          pincode: "",
          post: "",
          district: "",
          landmark: "",
          destination: "",
          salary: "",
          role: "teacher",
          permissions: defaultPermissions,
        });
        if (onSuccess) {
          onSuccess(response.data.teacher);
        } else {
          setTimeout(() => {
            // navigate("/login");
            alert("Successfull register");
          }, 1200);
        }
      } else {
        setMessage(response.data.message || "Registration failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred during registration");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (name) => `
    w-full rounded-lg border-2 px-4 py-3 text-gray-700 font-medium placeholder-gray-400 transition-all duration-300 focus:outline-none
    ${focusedField === name ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-200" : "border-gray-300 bg-white hover:border-gray-400"}
  `;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 p-2">
        <div className="mb-4">
          <p className="p-3 text-5xl font-bold text-gray-500 drop-shadow-lg">Add Staff</p>
        </div>

        <div className="w-full">
          {message && (
            <div
              className={`mb-4 rounded-xl border-2 p-4 transition-all duration-300 ${
                messageType === "success"
                  ? "border-green-400 bg-green-50/80 text-green-700 shadow-lg shadow-green-100"
                  : "border-red-400 bg-red-50/80 text-red-700 shadow-lg shadow-red-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{messageType === "success" ? "OK" : "!"}</span>
                <span className="font-semibold">{message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="grid w-full grid-cols-1 gap-2 rounded bg-gray-300 p-4 shadow md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold uppercase tracking-wide text-gray-800">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("name")}
                  placeholder="E.g., John Doe"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold uppercase tracking-wide text-gray-800">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("email")}
                  placeholder="E.g., staff@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold uppercase tracking-wide text-gray-800">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("password")}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold uppercase tracking-wide text-gray-800">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("mobile")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("mobile")}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold uppercase tracking-wide text-gray-800">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("role")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("role")}
                >
                  {STAFF_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded bg-gray-300 p-4 shadow">
              <h3 className="text-lg font-bold text-purple-900">Address Details</h3>
              <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses("address")}
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">Pincode</label>
                  <input
                    type="number"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("pincode")}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses("pincode")}
                    placeholder="Postal code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("landmark")}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses("landmark")}
                    placeholder="Nearby landmark"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("district")}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses("district")}
                    placeholder="District name"
                  />
                </div>
              </div>
            </div>

            <div className="rounded bg-gray-300 p-4 shadow">
              <h3 className="p-2 text-lg font-bold text-green-900">Professional Details</h3>
              <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">Post/Designation</label>
                  <input
                    type="text"
                    name="post"
                    value={formData.post}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("post")}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses("post")}
                    placeholder="E.g., Senior Teacher"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">Department/Specialization</label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("destination")}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses("destination")}
                    placeholder="E.g., Mathematics"
                  />
                </div>
              </div>

              <div className="p-2">
                <label className="mb-2 block text-sm font-semibold text-gray-800">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("salary")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("salary")}
                  placeholder="Annual salary (optional)"
                />
              </div>
            </div>

            <div className="rounded bg-gray-300 p-4 shadow">
              <h3 className="p-2 text-lg font-bold text-slate-900">Authority Access</h3>
              <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2">
                {STAFF_PERMISSION_OPTIONS.map((permission) => (
                  <label key={permission.value} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={formData.permissions.includes(permission.value)} onChange={() => handlePermissionChange(permission.value)} />
                    <span>{permission.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-3 w-full rounded-xl py-4 text-lg font-bold uppercase tracking-wider transition-all duration-300 ${
                loading ? "cursor-not-allowed bg-gray-400" : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg hover:scale-105 hover:shadow-2xl"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                  Saving...
                </div>
              ) : (
                "Create Staff Account"
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-white/80">
          <p>© 2026 Staff Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
