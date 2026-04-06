import React, { useMemo, useState } from "react";
import api from "../../api/axios";
import StudentDocumentFields from "../student/StudentDocumentFields";
import {
  buildExistingDocuments,
  createDocumentItem,
  normalizeStudentDocuments,
  resolveDocumentType,
} from "../../utils/studentDocuments";
import { getSafeAssetUrl } from "../student/StudentProfileSheet";

const FIELD_GROUPS = [
  {
    title: "Basic Details",
    fields: [
      ["name", "Full Name"],
      ["email", "Email", "email"],
      ["password", "Password", "password"],
      ["mobile", "Mobile"],
      ["role", "Role"],
    ],
  },
  {
    title: "Professional Details",
    fields: [
      ["destination", "Post / Designation"],
      ["branch", "Department / Specialization"],
      ["salary", "Salary", "number"],
      ["joiningDate", "Joining Date", "date"],
    ],
  },
  {
    title: "Address Details",
    fields: [
      ["address", "Address"],
      ["landmark", "Landmark"],
      ["district", "District"],
      ["post", "Post Office"],
      ["pincode", "Pincode"],
    ],
  },
];

const EDITABLE_KEYS = [...new Set(FIELD_GROUPS.flatMap((group) => group.fields.map(([key]) => key)))];

const TeacherEditModal = ({ teacher, onClose, onSaved }) => {
  const [formData, setFormData] = useState(() => ({
    ...teacher,
    password: "",
    joiningDate: teacher?.joiningDate ? String(teacher.joiningDate).slice(0, 10) : "",
  }));
  const [documents, setDocuments] = useState(() =>
    normalizeStudentDocuments(teacher?.documents),
  );
  const [imageFile, setImageFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : getSafeAssetUrl(teacher?.imgSrc)),
    [imageFile, teacher?.imgSrc],
  );
  const signaturePreview = useMemo(
    () => (signatureFile ? URL.createObjectURL(signatureFile) : getSafeAssetUrl(teacher?.signature)),
    [signatureFile, teacher?.signature],
  );

  const updateDocument = (index, field, value) => {
    setDocuments((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();

      EDITABLE_KEYS.forEach((key) => {
        const value = formData[key];
        if (value !== undefined && value !== null && value !== "") {
          payload.append(key, value);
        }
      });

      if (Array.isArray(formData.permissions)) {
        formData.permissions.forEach((permission) => payload.append("permissions", permission));
      }
      if (typeof formData.isActive === "boolean") {
        payload.append("isActive", formData.isActive);
      }
      if (imageFile) payload.append("imgSrc", imageFile);
      if (signatureFile) payload.append("signature", signatureFile);

      payload.append(
        "existingDocuments",
        JSON.stringify(buildExistingDocuments(documents)),
      );

      documents
        .filter((item) => item.file)
        .forEach((item) => {
          const documentType = resolveDocumentType(item);
          if (!documentType) return;
          payload.append("documents", item.file);
          payload.append("docTypes", documentType);
        });

      const response = await api.put(`/teacher/profile/${teacher._id}`, payload);
      if (response.data?.success) {
        onSaved?.(response.data.teacher);
      }
    } catch (error) {
      window.alert(error.response?.data?.message || "Error updating teacher");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Edit Teacher
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {teacher?.name || "Teacher"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto px-6 pt-6 ">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">Photo</h3>
                {imagePreview ? (
                  <img src={imagePreview} alt="Teacher" className="mt-4 h-56 w-full rounded-2xl object-fit" />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white"
                />
              </section>

              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">Signature</h3>
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Signature" className="mt-4 h-28 w-full rounded-2xl object-contain" />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white"
                />
              </section>
            </div>

            <div className="space-y-6">
              {FIELD_GROUPS.map((group) => (
                <section key={group.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900">{group.title}</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {group.fields.map(([key, label, type = "text"]) => (
                      <div key={`${group.title}-${key}`}>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          {label}
                        </label>
                        <input
                          type={type}
                          value={formData[key] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400 text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">Documents</h3>
                <div className="mt-4 text-slate-700">
                  <StudentDocumentFields
                    documents={documents}
                    onDocumentChange={updateDocument}
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

          <div className="sticky bottom-0 mt-6 flex justify-end gap-3 border-t border-slate-200 bg-white p-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherEditModal;
