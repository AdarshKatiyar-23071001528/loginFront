import React, { useMemo, useState } from "react";
import TeacherEditModal from "./TeacherEditModal";
import { getSafeAssetUrl } from "../student/StudentProfileSheet";
import api from "../../api/axios";
import DocumentPreview from "../shared/DocumentPreview";

const InfoGrid = ({ title, items }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-xl font-black text-slate-900">{title}</h3>
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {value || "-"}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-IN");
};

const TeacherProfilePanel = ({ teacher, onTeacherUpdated }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState("");

  const documents = Array.isArray(teacher?.documents) ? teacher.documents : [];
  const permissionBadges = useMemo(
    () => (Array.isArray(teacher?.permissions) ? teacher.permissions : []),
    [teacher?.permissions],
  );

  const handleDeleteDocument = async (documentUrl) => {
    if (!teacher?._id || !documentUrl) return;
    if (!window.confirm("Delete this document?")) return;

    setDeletingUrl(documentUrl);
    try {
      const payload = new FormData();
      const existingDocuments = documents
        .filter((item) => item?.url && item.url !== documentUrl)
        .map((item) => ({
          type: item.type,
          url: item.url,
        }))
        .filter((item) => item.type && item.url);

      payload.append("existingDocuments", JSON.stringify(existingDocuments));

      const response = await api.put(`/teacher/profile/${teacher._id}`, payload);
      if (response.data?.success) {
        onTeacherUpdated?.(response.data.teacher);
      }
    } catch (error) {
      window.alert(error.response?.data?.message || "Unable to delete document");
    } finally {
      setDeletingUrl("");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 px-6 py-6 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="h-32 w-28 overflow-hidden rounded-3xl border border-white/15 bg-white/10">
                {getSafeAssetUrl(teacher?.imgSrc) ? (
                  <img
                    src={getSafeAssetUrl(teacher.imgSrc)}
                    alt={teacher?.name || "Teacher"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl font-black">
                    {String(teacher?.name || "T").charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
                  Staff Profile
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  {teacher?.name || "Staff Member"}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {[teacher?.role, teacher?.destination, teacher?.email]
                    .filter(Boolean)
                    .join(" | ") || "Profile details"}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    Mobile: {teacher?.mobile || "-"}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    Joining: {formatDate(teacher?.joiningDate)}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    Status: {teacher?.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Edit Profile
            </button>
          </div>
        </section>

        <InfoGrid
          title="Professional Details"
          items={[
            ["Role", teacher?.role],
            ["Designation", teacher?.post],
            ["Department", teacher?.destination],
            ["Email", teacher?.email],
            ["Mobile", teacher?.mobile],
            ["Salary", teacher?.salary],
            ["Joining Date", formatDate(teacher?.joiningDate)],
            ["Status", teacher?.isActive === false ? "Inactive" : "Active"],
          ]}
        />

        <InfoGrid
          title="Address Details"
          items={[
            ["Address", teacher?.address],
            ["Landmark", teacher?.landmark],
            ["District", teacher?.district],
            ["Pincode", teacher?.pincode],
          ]}
        />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">Documents</h3>
              <p className="mt-2 text-sm text-slate-500">
                Uploaded identity proofs, certificates, and staff files.
              </p>
            </div>
            {getSafeAssetUrl(teacher?.signature) ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Signature
                </p>
                <img
                  src={getSafeAssetUrl(teacher.signature)}
                  alt="Signature"
                  className="mt-2 h-16 w-40 object-contain"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {documents.length ? (
              documents.map((documentItem, index) => (
                <div
                  key={`${documentItem.type}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Document
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {documentItem.type || `Document ${index + 1}`}
                  </p>
                  <div className="mt-4 space-y-4">
                    <DocumentPreview
                      url={getSafeAssetUrl(documentItem.url)}
                      title={documentItem.type || `Document ${index + 1}`}
                      className="h-64"
                    />
                    <div className="flex gap-3">
                    <a
                      href={getSafeAssetUrl(documentItem.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Open file
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(documentItem.url)}
                      disabled={deletingUrl === documentItem.url}
                      className="text-sm font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                    >
                      {deletingUrl === documentItem.url ? "Deleting..." : "Delete"}
                    </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                No documents uploaded.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-slate-900">Permissions</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {permissionBadges.length ? (
              permissionBadges.map((permission) => (
                <span
                  key={permission}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  {permission}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No permissions assigned.</span>
            )}
          </div>
        </section>
      </div>

      {editOpen ? (
        <TeacherEditModal
          teacher={teacher}
          onClose={() => setEditOpen(false)}
          onSaved={(updatedTeacher) => {
            onTeacherUpdated?.(updatedTeacher);
            setEditOpen(false);
          }}
        />
      ) : null}
    </>
  );
};

export default TeacherProfilePanel;
