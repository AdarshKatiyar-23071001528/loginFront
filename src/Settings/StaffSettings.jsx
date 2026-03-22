import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { STAFF_PERMISSION_OPTIONS, STAFF_ROLES } from "../constants/staff";

const roleMap = Object.fromEntries(STAFF_ROLES.map((item) => [item.value, item.label]));
const permissionMap = Object.fromEntries(STAFF_PERMISSION_OPTIONS.map((item) => [item.value, item.label]));

const StaffSettings = ({ refreshKey = 0 }) => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");
  const [availablePermissions, setAvailablePermissions] = useState(STAFF_PERMISSION_OPTIONS.map((item) => item.value));
  const [drafts, setDrafts] = useState({});

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get("/teacher/allteacher");
      const teachers = res.data?.teachers || [];
      setStaffList(teachers);
      setAvailablePermissions(res.data?.availablePermissions || STAFF_PERMISSION_OPTIONS.map((item) => item.value));
      const nextDrafts = {};
      for (const staff of teachers) {
        nextDrafts[staff._id] = {
          role: staff.role || "teacher",
          permissions: staff.permissions || [],
          isActive: staff.isActive !== false,
        };
      }
      setDrafts(nextDrafts);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load staff access settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [refreshKey]);

  const sortedPermissions = useMemo(
    () => STAFF_PERMISSION_OPTIONS.filter((item) => availablePermissions.includes(item.value)),
    [availablePermissions]
  );

  const togglePermission = (staffId, permission) => {
    setDrafts((prev) => {
      const current = prev[staffId] || { role: "teacher", permissions: [], isActive: true };
      const exists = current.permissions.includes(permission);
      return {
        ...prev,
        [staffId]: {
          ...current,
          permissions: exists ? current.permissions.filter((item) => item !== permission) : [...current.permissions, permission],
        },
      };
    });
  };

  const handleSave = async (staffId) => {
    const draft = drafts[staffId];
    if (!draft) return;
    setSavingId(staffId);
    try {
      const res = await api.put(`/teacher/permissions/${staffId}`, draft);
      if (res.data?.success) {
        setMessage("Staff authority updated");
        await loadStaff();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update staff authority");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Settings</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Staff Access Control</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Yahan admin jitne staff add kare sab dikhte hain. Har staff ko role, access, aur active status ke hisab se authority de sakte ho.
        </p>
      </div>

      {message ? <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">{message}</div> : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">Loading staff settings...</div>
      ) : staffList.length ? (
        <div className="space-y-4">
          {staffList.map((staff) => {
            const draft = drafts[staff._id] || { role: staff.role || "teacher", permissions: staff.permissions || [], isActive: staff.isActive !== false };
            return (
              <div key={staff._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{staff.name || "Unnamed Staff"}</h3>
                    <p className="mt-1 text-sm text-slate-600">{staff.email || "No email"} • {staff.post || staff.destination || "Staff member"}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">{roleMap[draft.role] || draft.role}</span>
                      <span className={`rounded-full px-3 py-1 font-semibold ${draft.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {draft.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-slate-700">
                      <span>Role</span>
                      <select
                        value={draft.role}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [staff._id]: { ...draft, role: e.target.value } }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400"
                      >
                        {STAFF_ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={draft.isActive}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [staff._id]: { ...draft, isActive: e.target.checked } }))}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      Account Active
                    </label>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-slate-900">Authorities</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {sortedPermissions.map((permission) => (
                      <label key={permission.value} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${draft.permissions.includes(permission.value) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                        <input
                          type="checkbox"
                          checked={draft.permissions.includes(permission.value)}
                          onChange={() => togglePermission(staff._id, permission.value)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        <span>{permissionMap[permission.value] || permission.value}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave(staff._id)}
                    disabled={savingId === staff._id}
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {savingId === staff._id ? "Saving..." : "Save Authority"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          Abhi tak koi staff add nahi hua.
        </div>
      )}
    </section>
  );
};

export default StaffSettings;
