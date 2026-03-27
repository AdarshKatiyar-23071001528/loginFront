import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { setAuthUser } from "../../utils/auth";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const fieldClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-IN");
};

const AdminProfilePanel = ({ admin, onSaved }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    imgSrc: "",
    instituteName: "",
    instituteLogo: "",
    role: "admin",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: admin?.name || "",
      email: admin?.email || "",
      mobile: admin?.mobile ? String(admin.mobile) : "",
      imgSrc: admin?.imgSrc || "",
      instituteName: admin?.instituteName || "",
      instituteLogo: admin?.instituteLogo || "",
      role: admin?.role || "admin",
      password: "",
    });
  }, [admin]);

  const overview = useMemo(
    () => [
      { label: "Role", value: admin?.role || "admin" },
      { label: "Email", value: admin?.email || "-" },
      { label: "Mobile", value: admin?.mobile || "-" },
      { label: "Joined", value: formatDate(admin?.createdAt) },
    ],
    [admin],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const value = await fileToBase64(file);
    setForm((prev) => ({ ...prev, [field]: value }));
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!admin?._id) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        imgSrc: form.imgSrc,
        instituteName: form.instituteName,
        instituteLogo: form.instituteLogo,
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      const response = await api.put(`/user/profile/${admin._id}`, payload);
      if (response.data?.success) {
        const updatedAdmin = response.data.admin;
        setAuthUser(updatedAdmin);
        onSaved?.(updatedAdmin);
        alert(response.data.message || "Profile updated successfully");
        setForm((prev) => ({ ...prev, password: "" }));
      } else {
        alert(response.data?.message || "Unable to update profile");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!admin) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
        Loading admin profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Admin Profile
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              {admin?.name || "Administrator"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              View and update your admin account, institute details, and visual identity.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {overview.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{item.label}</p>
                <p className="mt-1 text-lg font-black break-words">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Preview
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">Current Branding</h3>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Profile Image</p>
              <div className="mt-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-slate-200">
                {form.imgSrc ? (
                  <img src={form.imgSrc} alt="Admin profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    No Image
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Institute Logo</p>
              <div className="mt-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-slate-200">
                {form.instituteLogo ? (
                  <img src={form.instituteLogo} alt="Institute logo" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    No Logo
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Edit Profile
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">Update Details</h3>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mobile</label>
                <input name="mobile" value={form.mobile} onChange={handleChange} className={fieldClassName} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <input name="role" value={form.role} className={fieldClassName} disabled />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Institute Name</label>
                <input
                  name="instituteName"
                  value={form.instituteName}
                  onChange={handleChange}
                  className={fieldClassName}
                  placeholder="Enter institute name"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={fieldClassName}
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Profile Image</span>
                <input type="file" accept="image/*" onChange={(event) => handleImageChange(event, "imgSrc")} className={`${fieldClassName} bg-black`} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Institute Logo</span>
                <input type="file" accept="image/*" onChange={(event) => handleImageChange(event, "instituteLogo")} className={fieldClassName} />
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminProfilePanel;
