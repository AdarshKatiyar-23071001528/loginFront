import React from "react";
import {
  DOCUMENT_TYPE_OPTIONS,
  resolveDocumentType,
} from "../../utils/studentDocuments";

const StudentDocumentFields = ({
  documents,
  onDocumentChange,
  onAddDocument,
  onRemoveDocument,
}) => (
  <div className="space-y-4">
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
            ) : (
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) =>
                  onDocumentChange(index, "file", e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white"
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

        {documentItem.url ? (
          <a
            href={documentItem.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            View current file
          </a>
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
