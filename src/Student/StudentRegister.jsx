import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import StudentDocumentFields from "../components/student/StudentDocumentFields";
import {
  createDocumentItem,
  resolveDocumentType,
} from "../utils/studentDocuments";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  rollno: "",
  enrollment: "",
  wrn: "",
  course: "",
  semester: "",
  section: "A",
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
  branch: "",
  reference: "",
  fees: "",
  convenienceFees: "",
  hostelFees: "",
  documentFees: "",
  otherFees: "",
  discount: "",
};

const sectionClass =
  "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";
const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [image, setImage] = useState(null);
  const [signature, setSignature] = useState(null);
  const [documents, setDocuments] = useState([createDocumentItem()]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    if (!formData.rollno.trim()) return "Roll number is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.password.trim()) return "Password is required";
    if (!formData.enrollment.trim()) return "Enrollment is required";
    if (!formData.mobile1.trim()) return "Mobile number is required";
    if (!formData.branch.trim()) return "Branch is required";
    if (!formData.reference.trim()) return "Reference is required";

    const invalidDocument = documents.find(
      (item) =>
        (item.file || item.url) &&
        !resolveDocumentType(item),
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
        if (value !== "") payload.append(key, value);
      });

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

      const response = await api.post("/student/register", payload);

      if (response.data.success) {
        setMessage("Registration successful");
        setMessageType("success");
        setFormData(initialFormState);
        setImage(null);
        setSignature(null);
        setDocuments([createDocumentItem()]);
        window.setTimeout(() => navigate("/student/login"), 800);
      } else {
        setMessage(response.data.message || "Registration failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
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
              Student Admission
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Student Registration
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Fill student details, upload photo and signature, and attach
              Aadhaar Card, Transfer Certificate, Character Certificate, or any
              new custom document.
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                      ["rollno", "Roll Number"],
                      ["enrollment", "Enrollment"],
                      ["wrn", "WRN"],
                      ["course", "Course"],
                      ["semester", "Semester", "number"],
                      ["section", "Section"],
                      ["branch", "Branch"],
                      ["reference", "Reference"],
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
                    Personal Details
                  </h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ["fathername", "Father Name"],
                      ["mothername", "Mother Name"],
                      ["mobile1", "Mobile 1"],
                      ["mobile2", "Mobile 2"],
                      ["mobile3", "Mobile 3"],
                      ["dob", "Date of Birth", "date"],
                      ["doa", "Date of Admission", "date"],
                      ["adhaar", "Aadhaar Number"],
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
                      ["post", "Post"],
                      ["district", "District"],
                      ["pincode", "Pincode"],
                    ].map(([name, label]) => (
                      <div key={name}>
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
                    Fee Structure
                  </h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ["fees", "Tuition Fees"],
                      ["convenienceFees", "Convenience Fees"],
                      ["hostelFees", "Hostel Fees"],
                      ["documentFees", "Documents Fees"],
                      ["otherFees", "Other Fees"],
                      ["discount", "Discount"],
                    ].map(([name, label]) => (
                      <div key={name}>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          {label}
                        </label>
                        <input
                          type="number"
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
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
                disabled={loading}
                className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Register Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
