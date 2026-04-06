import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import StudentDocumentFields from "../components/student/StudentDocumentFields";
import {
  createDocumentItem,
  resolveDocumentType,
} from "../utils/studentDocuments";
import {
  ALL_STAFF_PERMISSIONS,
  STAFF_PERMISSION_OPTIONS,
  STAFF_ROLES,
} from "../constants/staff";

const defaultPermissions = [
  "attendance.manage",
  "marks.manage",
  "subjects.read",
  "students.read",
];

const initialFormState = {
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
  branch:"",
  salary: "",
  joiningDate: "",
  role: "teacher",
  permissions: defaultPermissions,
};

const sectionClass =
  "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";
const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white";
const otpInputClass =
  "mt-2 w-full rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-center text-lg font-semibold tracking-[0.35em] text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white";

const TeacherRegister = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [image, setImage] = useState(null);
  const [signature, setSignature] = useState(null);
  const [documents, setDocuments] = useState([createDocumentItem()]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [otp, setOtp] = useState("");
  const [otpState, setOtpState] = useState({
    challengeToken: "",
    maskedEmail: "",
    teacher: null,
  });

  const resetForm = () => {
    setFormData(initialFormState);
    setImage(null);
    setSignature(null);
    setDocuments([createDocumentItem()]);
    setOtp("");
    setOtpState({ challengeToken: "", maskedEmail: "", teacher: null });
  };

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
        permissions: exists
          ? prev.permissions.filter((item) => item !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  const handleDocumentChange = (index, field, value) => {
    setDocuments((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email";
    }
    if (!formData.password.trim()) return "Password is required";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    if (!formData.mobile.trim()) return "Mobile number is required";
    if (!/^\d{10}$/.test(formData.mobile)) return "Please enter a valid 10-digit mobile number";

    const invalidDocument = documents.find(
      (item) => (item.file || item.url) && !resolveDocumentType(item),
    );
    if (invalidDocument) return "Please select or enter document name";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "permissions") return;
        if (value !== "") payload.append(key, value);
      });

      formData.permissions.forEach((permission) =>
        payload.append("permissions", permission),
      );

      if (image) payload.append("imgSrc", image);
      if (signature) payload.append("signature", signature);

      documents
        .filter((item) => item.file)
        .forEach((item) => {
          const documentType = resolveDocumentType(item);
          if (!documentType) return;
          payload.append("documents", item.file);
          payload.append("docTypes", documentType);
        });

      const response = await api.post("/teacher/register", payload);

      if (response.data.success) {
        setOtp("");
        setOtpState({
          challengeToken: response.data.challengeToken || "",
          maskedEmail: response.data.maskedEmail || formData.email,
          teacher: response.data.teacher || null,
        });
        setMessage(response.data.message || "OTP sent to teacher email");
        setMessageType("success");
      } else {
        setMessage(response.data.message || "Registration failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred during registration",
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setMessage("Please enter 6-digit OTP");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/teacher/verify-email-otp", {
        challengeToken: otpState.challengeToken,
        otp: otp.trim(),
      });

      if (response.data.success) {
        const verifiedTeacher = response.data.teacher || otpState.teacher;
        setMessage(response.data.message || "Teacher email verified successfully");
        setMessageType("success");
        resetForm();
        if (onSuccess) {
          onSuccess(verifiedTeacher);
        } else {
          window.setTimeout(() => navigate("/login"), 800);
        }
      } else {
        setMessage(response.data.message || "OTP verification failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!otpState.challengeToken) return;
    setLoading(true);
    try {
      const response = await api.post("/teacher/resend-email-otp", {
        challengeToken: otpState.challengeToken,
      });
      if (response.data.success) {
        setOtpState((prev) => ({
          ...prev,
          challengeToken: response.data.challengeToken || prev.challengeToken,
          maskedEmail: response.data.maskedEmail || prev.maskedEmail,
        }));
        setMessage(response.data.message || "OTP resent successfully");
        setMessageType("success");
      } else {
        setMessage(response.data.message || "Unable to resend OTP");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to resend OTP");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)] px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-700">
              Staff Enrollment
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Teacher Registration
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Fill staff details, upload photo and signature, and attach
              certificates, ID proof, or any custom document.
            </p>
          </div>

          {message ? (
            <div
              className={`mt-6 rounded-2xl px-4 py-3 text-sm font-semibold ${
                messageType === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {message}
            </div>
          ) : null}

          {otpState.challengeToken ? (
            <section className="mt-6 rounded-[1.75rem] border border-cyan-200 bg-cyan-50/80 p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
                    Email Verification
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    Verify teacher email
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    OTP sent to {otpState.maskedEmail}. Account will activate once verified.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="rounded-2xl border border-cyan-300 bg-white px-4 py-3 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>

              <form onSubmit={handleVerifyOtp} className="mt-5 flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className={otpInputClass}
                    placeholder="000000"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="rounded-2xl bg-cyan-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
              </form>
            </section>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className={`mt-6 space-y-6 ${otpState.challengeToken ? "opacity-70" : ""}`}
          >
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <section className={sectionClass}>
                  <h2 className="text-xl font-bold text-slate-900">
                    Basic Details
                  </h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ["name", "Full Name"],
                      ["email", "Email", "email"],
                      ["password", "Password", "password"],
                      ["mobile", "Mobile"],
                      ["role", "Role", "select"],
                      ["joiningDate", "Joining Date", "date"],
                    ].map(([name, label, type = "text"]) => (
                      <div key={name}>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          {label}
                        </label>
                        {type === "select" ? (
                          <select
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            {STAFF_ROLES.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={type}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            className={inputClass}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className={sectionClass}>
                  <h2 className="text-xl font-bold text-slate-900">
                    Professional Details
                  </h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ["destination", "Post / Designation"],
                      ["branch", "Department / Specialization"],
                      ["salary", "Salary", "number"],
                    ].map(([name, label, type = "text"]) => (
                      <div key={name}>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          {label}
                        </label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <section className={sectionClass}>
                  <h2 className="text-xl font-bold text-slate-900">
                    Address Details
                  </h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ["address", "Address"],
                      ["landmark", "Landmark"],
                      ["post", "Post Office"],
                      ["district", "District"],
                      ["pincode", "Pincode"],
                    ].map(([name, label]) => (
                      <div key={`${name}-${label}`}>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          {label}
                        </label>
                        <input
                          type="text"
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <section className={sectionClass}>
                  <h2 className="text-xl font-bold text-slate-900">
                    Authority Access
                  </h2>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {STAFF_PERMISSION_OPTIONS.map((permission) => (
                      <label
                        key={permission.value}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.value)}
                          onChange={() => handlePermissionChange(permission.value)}
                        />
                        <span>{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className={sectionClass}>
                  <h2 className="text-xl font-bold text-slate-900">Photo</h2>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-white"
                  />
                </section>

                <section className={sectionClass}>
                  <h2 className="text-xl font-bold text-slate-900">
                    Signature
                  </h2>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSignature(e.target.files?.[0] || null)}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-white"
                  />
                </section>

                <section className={sectionClass}>
                  <h2 className="text-xl font-bold text-slate-900">
                    Documents
                  </h2>
                  <div className="mt-4">
                    <StudentDocumentFields
                      documents={documents}
                      onDocumentChange={handleDocumentChange}
                      onAddDocument={() =>
                        setDocuments((prev) => [...prev, createDocumentItem()])
                      }
                      onRemoveDocument={(index) =>
                        setDocuments((prev) =>
                          prev.length === 1
                            ? [createDocumentItem()]
                            : prev.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    />
                  </div>
                </section>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || Boolean(otpState.challengeToken)}
                className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : otpState.challengeToken
                    ? "OTP Pending"
                    : "Register Teacher"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
