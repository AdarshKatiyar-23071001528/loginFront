import React from "react";
import {
  DOCUMENT_TYPE_OPTIONS,
  resolveDocumentType,
} from "../../utils/studentDocuments";
import { formatFileSize, UPLOAD_LIMITS } from "../../utils/uploadValidation";
import { getDocumentAssetUrl } from "./StudentProfileSheet";

const getDocumentMeta = (documentItem = {}) => {
  const source = String(
    documentItem?.file?.type || documentItem?.file?.name || documentItem?.url || "",
  ).toLowerCase();
  const isPdf = source.includes("pdf");

  return {
    badge: isPdf ? "PDF" : "IMAGE",
    badgeClassName: isPdf
      ? "bg-rose-100 text-rose-700"
      : "bg-cyan-100 text-cyan-700",
  };
};

const StudentDocumentFields = ({
  documents,
  onDocumentChange,
  onAddDocument,
  onRemoveDocument,
  validationError = "",
}) => (
  <div className="space-y-4">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
      Images/signatures max {formatFileSize(UPLOAD_LIMITS.image)}. Documents max {formatFileSize(UPLOAD_LIMITS.document)}.
    </p>

    {validationError ? (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
        {validationError}
      </div>
    ) : null}

    {documents.map((documentItem, index) => (
      <div
        key={documentItem.id || index}
        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Document Type
            </label>
            <select
              value={documentItem.type}
              onChange={(e) => onDocumentChange(index, "type", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-slate-400"
            >
              <option value="">Select document</option>
              {DOCUMENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {documentItem.type === "custom" ? "Custom Name" : "File"}
            </label>
            {documentItem.type === "custom" ? (
              <input
                type="text"
                value={documentItem.customType}
                onChange={(e) =>
                  onDocumentChange(index, "customType", e.target.value)
                }
                placeholder="Enter document name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-slate-400"
              />
            ) : (
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) =>
                  onDocumentChange(index, "file", e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white"
              />
            )}
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => onRemoveDocument(index)}
              disabled={documents.length === 1}
              className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        </div>

        {documentItem.type === "custom" ? (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              File
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) =>
                onDocumentChange(index, "file", e.target.files?.[0] || null)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white"
            />
          </div>
        ) : null}

        {resolveDocumentType(documentItem) ? (
          <p className="mt-3 text-sm text-slate-500">
            Selected: {resolveDocumentType(documentItem)}
          </p>
        ) : null}

        {documentItem.file || documentItem.url ? (
          <div className="mt-4 space-y-3">
            {(() => {
              const documentMeta = getDocumentMeta(documentItem);
              return (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${documentMeta.badgeClassName}`}>
                    {documentMeta.badge}
                  </span>
                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    {resolveDocumentType(documentItem) || `Document ${index + 1}`}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {documentItem.file
                      ? "New file selected. Save changes to upload it."
                      : "Current uploaded file available for opening in a new tab."}
                  </p>
                </div>
              );
            })()}

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-500">
                {documentItem.file
                  ? `Selected file: ${documentItem.file.name}`
                  : "Current uploaded file"}
              </span>

              {!documentItem.file && documentItem.url ? (
                <a
                  href={getDocumentAssetUrl(documentItem.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open current file
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    ))}

    <button
      type="button"
      onClick={onAddDocument}
      className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      Add Another Document
    </button>
  </div>
);

export default StudentDocumentFields;
