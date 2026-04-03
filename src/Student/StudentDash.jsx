import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaBell, FaCalendarAlt, FaFileUpload, FaIdCard, FaMoneyBillWave, FaPhoneAlt } from "react-icons/fa";
import api from "../api/axios";
import { CiLogout } from "react-icons/ci";
import { clearAuthToken } from "../utils/auth";
import { FEE_TYPE_OPTIONS, getFeeTotals } from "../utils/studentFees";
import StudentNotice from "./StudentNotice";
import { getSafeAssetUrl } from "../components/student/StudentProfileSheet";
import StudentDocumentsPanel from "../components/student/StudentDocumentsPanel";

const tabs = [
  { id: "overview", label: "Overview", icon: FaIdCard },
  { id: "attendance", label: "Attendance", icon: FaCalendarAlt },
  { id: "fees", label: "Fees", icon: FaMoneyBillWave },
  { id: "documents", label: "Documents", icon: FaFileUpload },
  {id: "notice", label:"Notice", icon: FaBell},
   { id: "logout", label: "Logout", icon: CiLogout },
];

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const formatAmount = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const StudentDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();
  const queryId = useMemo(() => new URLSearchParams(location.search).get("id"), [location.search]);
  const studentId = paramId || queryId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    feeType: "tuition",
    amount: "",
    transactionId: "",
    paymentMethod: "UPI",
    screenshot: "",
    screenshotName: "",
  });

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      setError("No student id provided. Please log in to view your dashboard.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, attendanceRes] = await Promise.all([
          api.get(`/student/profile/${studentId}`),
          api.get(`/attendance/student/${studentId}`),
        ]);

        if (profileRes.data?.success) setProfile(profileRes.data.student);
        else setError(profileRes.data?.message || "Failed to load profile");

        setAttendance(attendanceRes.data?.success ? attendanceRes.data.records || [] : []);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const feeTotals = useMemo(() => getFeeTotals(profile || {}), [profile]);
  const feeDue = feeTotals.pending;
  const selectedFeePending = feeTotals.summary?.[paymentForm.feeType || "tuition"]?.pending || 0;
  const attendancePresent = attendance.filter((item) => String(item?.status || "").toLowerCase() === "present").length;

  const handleImageUpdate = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !studentId) return;

    const payload = new FormData();
    payload.append("imgSrc", file);

    setImageUploading(true);
    try {
      const res = await api.put(`/student/profile/update/${studentId}`, payload);
      if (res.data?.success) {
        setProfile(res.data.student);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Image update failed");
    } finally {
      setImageUploading(false);
      event.target.value = "";
    }
  };

  const handlePaymentChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "screenshot") {
      const file = files?.[0];
      if (!file) {
        setPaymentForm((prev) => ({ ...prev, screenshot: "", screenshotName: "" }));
        return;
      }
      const base64 = await fileToBase64(file);
      setPaymentForm((prev) => ({ ...prev, screenshot: base64, screenshotName: file.name }));
      return;
    }
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const refreshProfile = async () => {
    const res = await api.get(`/student/profile/${studentId}`);
    if (res.data?.success) setProfile(res.data.student);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return navigate("/student/login");
    if (!paymentForm.amount || !paymentForm.transactionId) {
      alert("Please fill all required fields");
      return;
    }
    if (Number(paymentForm.amount) > Number(selectedFeePending)) {
      alert("Amount cannot be greater than pending fees of selected fee type");
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await api.put("/student/uploadPayment", {
        studentId,
        amount: Number(paymentForm.amount),
        feeType: paymentForm.feeType || "tuition",
        transactionId: paymentForm.transactionId,
        paymentMethod: paymentForm.paymentMethod || "UPI",
        screenshot: paymentForm.screenshot || null,
      });

      if (res.data?.message) {
        alert("Payment uploaded successfully. Waiting for admin approval.");
        setPaymentForm({ feeType: "tuition", amount: "", transactionId: "", paymentMethod: "UPI", screenshot: "", screenshotName: "" });
        await refreshProfile();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error uploading payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium backdrop-blur">
            Loading student dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Student Portal</p>
          <h1 className="mt-3 text-3xl font-black">Unable to load dashboard</h1>
          <p className="mt-3 text-slate-300">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="border-b border-white/10 bg-white/5 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">Student Portal</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Welcome{profile?.name ? `, ${profile.name}` : ""}
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                  Your profile, attendance, and fee submission are available in one clean dashboard.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStat label="Due Fees" value={formatAmount(feeDue)} />
                <MiniStat label="Paid Fees" value={formatAmount(feeTotals.paid)} />
                <MiniStat label="Present Days" value={attendancePresent} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[280px_1fr] lg:px-8">
            <aside className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/95 p-5 text-slate-900 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl">
                    {getSafeAssetUrl(profile?.imgSrc) ? (
                      <img
                        src={getSafeAssetUrl(profile?.imgSrc)}
                        alt={profile?.name || "Student"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-black text-white">
                        {profile?.name ? profile.name.charAt(0) : "S"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Student</p>
                    <h2 className="text-xl font-black">{profile?.name || "Student"}</h2>
                    <p className="text-sm text-slate-600">
                      {profile?.course || "Course"} {profile?.semester ? `- Sem ${profile.semester}` : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <Line label="WRN" value={profile?.wrn || "-"} />
                  <Line label="Section" value={profile?.section || "-"} />
                  <Line label="Enrollment" value={profile?.enrollment || "-"} />
                  <Line label="Mobile" value={profile?.mobile1 || "-"} icon={FaPhoneAlt} />
                </div>

                <label className="mt-5 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  <span>{imageUploading ? "Updating image..." : "Update profile image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpdate}
                    className="hidden"
                    disabled={imageUploading}
                  />
                </label>
              </div>

              <div className="grid gap-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                     onClick={ tab.id === "logout" ? () => {clearAuthToken(),navigate('https://skitedu.in/')} : () => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                        active
                          ? "border-cyan-300/40 bg-cyan-400/15 text-white shadow-lg"
                          : tab.id === "logout" ? "border-white/10 bg-white/5 text-red-400 hover:bg-white/10" :"border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white"}`}>
                        <Icon />
                      </span>
                      <span>
                        <span className="block font-semibold">{tab.label}</span>
                        <span className="block text-xs text-slate-400">
                          {tab.id === "overview"
                            ? "Profile details"
                            : tab.id === "attendance"
                              ? "Presence records"
                              : tab.id === "documents"
                                ? "Upload your files"
                                : tab.id === "notice"
                                  ? "Announcements"
                                  : tab.id === "logout"
                                    ? "Logout From Device"
                                    : "Fee payment"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <main className="space-y-6">
              {activeTab === "overview" && (
                <Panel title="Student Information" subtitle="Quick profile snapshot">
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[
                      ["Name", profile?.name],
                      ["WRN", profile?.wrn],
                      ["Enrollment", profile?.enrollment],
                      ["Course", profile?.course],
                      ["Semester", profile?.semester],
                      ["Section", profile?.section],
                      ["Branch", profile?.branch],
                      ["Email", profile?.email],
                      ["Father", profile?.fathername],
                      ["Mother", profile?.mothername],
                      ["Address", profile?.address],
                      ["Mobile", profile?.mobile1],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
                        <p className="mt-2 text-sm font-semibold">{value || "-"}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}

              {activeTab === "attendance" && (
                <Panel title="Attendance" subtitle="Your attendance history">
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Metric label="Present" value={attendancePresent} tone="emerald" />
                    <Metric label="Total" value={attendance.length} tone="slate" />
                    <Metric label="Attendance%" value={attendance.length ? Math.round((attendancePresent / attendance.length) * 100) : 0} tone="blue" />
                  </div>

                  <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
                    <div className="grid grid-cols-12 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      <div className="col-span-4">Date</div>
                      <div className="col-span-4">Status</div>
                      <div className="col-span-4">Note</div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {attendance.length ? (
                        attendance.map((item, index) => (
                          <div key={item?._id || index} className="grid grid-cols-12 px-4 py-4 text-sm text-slate-900">
                            <div className="col-span-4 font-medium">{formatDate(item?.date || item?.createdAt)}</div>
                            <div className="col-span-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  String(item?.status || "").toLowerCase() === "present"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-rose-100 text-rose-700"
                                }`}
                              >
                                {item?.status || "-"}
                              </span>
                            </div>
                            <div className="col-span-4 text-slate-500">{item?.subject?.name || item?.subjectId?.name || item?.subjectId || item?.subject || "-"}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-sm text-slate-500">No attendance records found.</div>
                      )}
                    </div>
                  </div>
                </Panel>
              )}

              {activeTab === "fees" && (
                <div className="flex flex-col gap-5">
                  <Panel title="Fee Summary" subtitle="Current fee overview">
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <Metric label="Total Fees" value={formatAmount(feeTotals.total)} tone="blue" />
                      <Metric label="Paid Fees" value={formatAmount(feeTotals.paid)} tone="emerald" />
                      <Metric label="Balance Due" value={formatAmount(feeDue)} tone="rose" />
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {feeTotals.list.map((item) => (
                        <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                          <div className="mt-3 space-y-2 text-sm text-slate-700">
                            <div className="flex items-center justify-between gap-3">
                              <span>Total</span>
                              <span className="font-semibold">{formatAmount(item.total)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span>Paid</span>
                              <span className="font-semibold text-emerald-700">{formatAmount(item.paid)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span>Pending</span>
                              <span className="font-semibold text-rose-700">{formatAmount(item.pending)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* <form onSubmit={handlePaymentSubmit} className="mt-6 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Fee Type</label>
                          <select
                            name="feeType"
                            value={paymentForm.feeType}
                            onChange={handlePaymentChange}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                          >
                            {FEE_TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Field label="Amount" name="amount" type="number" value={paymentForm.amount} onChange={handlePaymentChange} placeholder="Enter amount" />
                        <Field label="Transaction ID" name="transactionId" type="text" value={paymentForm.transactionId} onChange={handlePaymentChange} placeholder="UPI / Bank reference" />
                        <Field label="Payment Method" name="paymentMethod" type="text" value={paymentForm.paymentMethod} onChange={handlePaymentChange} placeholder="UPI / Cash / Bank" />
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Screenshot</label>
                          <label className="flex min-h-11 cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100">
                            <span className="flex items-center gap-2">
                              <FaFileUpload className="text-slate-400" />
                              {paymentForm.screenshotName || "Choose file"}
                            </span>
                            <input type="file" name="screenshot" accept="image/*" onChange={handlePaymentChange} className="hidden" />
                          </label>
                        </div>
                      </div>

                      <p className="text-sm text-slate-500">
                        Pending for selected fee type: {formatAmount(selectedFeePending)}
                      </p>

                      <button
                        type="submit"
                        disabled={paymentLoading}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {paymentLoading ? "Uploading..." : "Upload Payment"}
                      </button>
                    </form> */}
                  </Panel>

                  <Panel title="Payment History" subtitle="Latest payment entries">
                    <div className="mt-6 space-y-3 max-h-[32rem] overflow-auto pr-1">
                      {profile?.payments?.length ? (
                        profile.payments.map((payment, index) => (
                          <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-lg font-black">{formatAmount(payment?.amount)}</p>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                  {FEE_TYPE_OPTIONS.find((item) => item.value === payment?.feeType)?.label || "Tuition Fees"} • {payment?.paymentMethod || "UPI"}
                                </p>
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  String(payment?.status || "").toLowerCase() === "approved"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : String(payment?.status || "").toLowerCase() === "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-rose-100 text-rose-700"
                                }`}
                              >
                                {payment?.status || "pending"}
                              </span>
                            </div>
                            <div className="mt-3 grid gap-1 text-sm text-slate-600">
                              <div>TxID: {payment?.transactionId || "-"}</div>
                              <div>Date: {formatDate(payment?.paidAt || payment?.date)}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                          No payment history available yet.
                        </div>
                      )}
                    </div>
                  </Panel>
                </div>
              )}

              {activeTab === "documents" && (
                <StudentDocumentsPanel
                  student={profile}
                  studentId={studentId}
                  onSaved={(updatedStudent) => setProfile(updatedStudent)}
                />
              )}


              {activeTab === "notice" && (
                <Panel title="Notice" subtitle="Send By Administrator">
                    <StudentNotice forWhich = "student"/>
                </Panel>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

const Panel = ({ title, subtitle, children }) => (
  <section className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{subtitle}</p>
      <h3 className="mt-1 text-2xl font-black">{title}</h3>
    </div>
    {children}
  </section>
);

const Field = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input
      {...props}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
    />
  </div>
);

const Line = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
    <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
      {Icon ? <Icon className="text-slate-400" /> : null}
      {label}
    </span>
    <span className="max-w-[60%] truncate text-sm font-semibold text-slate-900">{value}</span>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <p className="mt-1 text-xl font-black text-white">{value}</p>
  </div>
);

const Metric = ({ label, value, tone = "slate" }) => {
  const styles = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    rose: "bg-rose-100 text-rose-700",
  };

  return (
    <div className={`rounded-2xl px-4 py-3 ${styles[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
};

export default StudentDash;
