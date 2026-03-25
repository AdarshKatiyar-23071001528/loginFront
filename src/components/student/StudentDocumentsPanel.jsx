import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StudentDocumentFields from "./StudentDocumentFields";
import {
  createDocumentItem,
  normalizeStudentDocuments,
  resolveDocumentType,
} from "../../utils/studentDocuments";
import { getSafeAssetUrl } from "./StudentProfileSheet";

const StudentDocumentsPanel = ({ student, studentId, onSaved }) => {
  const [documents, setDocuments] = useState(() =>
    normalizeStudentDocuments(student?.documents),
  );
  const [saving, setSaving] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState("");

  useEffect(() => {
    setDocuments(normalizeStudentDocuments(student?.documents));
  }, [student?.documents]);

  const updateDocument = (index, field, value) => {
    setDocuments((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return;

    setSaving(true);
    try {
      const payload = new FormData();

      const existingDocuments = documents
        .filter((item) => item.url)
        .map((item) => ({
          type: resolveDocumentType(item),
          url: item.url,
        }))
        .filter((item) => item.type && item.url);

      payload.append("existingDocuments", JSON.stringify(existingDocuments));

      documents
        .filter((item) => item.file)
        .forEach((item) => {
          const documentType = resolveDocumentType(item);
          if (!documentType) return;
          payload.append("documents", item.file);
          payload.append("docTypes", documentType);
        });

      const response = await api.put(`/student/profile/update/${studentId}`, payload);
      if (response.data?.success) {
        onSaved?.(response.data.student);
      }
    } catch (error) {
      window.alert(error.response?.data?.message || "Unable to update documents");
    } finally {
      setSaving(false);
    }
  };

  const uploadedDocuments = Array.isArray(student?.documents) ? student.documents : [];

  const handleDeleteDocument = async (documentUrl) => {
    if (!studentId || !documentUrl) return;
    if (!window.confirm("Delete this document?")) return;

    setDeletingUrl(documentUrl);
    try {
      const payload = new FormData();
      const existingDocuments = uploadedDocuments
        .filter((item) => item?.url && item.url !== documentUrl)
        .map((item) => ({
          type: item.type,
          url: item.url,
        }))
        .filter((item) => item.type && item.url);

      payload.append("existingDocuments", JSON.stringify(existingDocuments));

      const response = await api.put(`/student/profile/update/${studentId}`, payload);
      if (response.data?.success) {
        onSaved?.(response.data.student);
      }
    } catch (error) {
      window.alert(error.response?.data?.message || "Unable to delete document");
    } finally {
      setDeletingUrl("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Student Documents
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">
              Upload and manage your files
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Aadhaar, certificates, and other required files yahan se update
              kar sakte ho. Save karte hi latest documents list refresh ho
              jayegi.
            </p>
          </div>

          {getSafeAssetUrl(student?.signature) ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Signature
              </p>
              <img
                src={getSafeAssetUrl(student.signature)}
                alt="Signature"
                className="mt-2 h-16 w-40 object-contain"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Uploaded Files
            </p>
            <h3 className="mt-2 text-xl font-black text-slate-900">
              Current documents
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {uploadedDocuments.length} file{uploadedDocuments.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {uploadedDocuments.length ? (
            uploadedDocuments.map((documentItem, index) => (
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
                <div className="mt-4 flex gap-3">
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
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
              No documents uploaded yet.
            </div>
          )}
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Update Documents
            </p>
            <h3 className="mt-2 text-xl font-black text-slate-900">
              Add new files or remove old ones
            </h3>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Documents"}
          </button>
        </div>

        <div className="mt-5">
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
      </form>
    </div>
  );
};

export default StudentDocumentsPanel;
