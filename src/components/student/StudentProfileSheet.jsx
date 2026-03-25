import React from "react";
import { getFeeTotals } from "../../utils/studentFees";
import collegeLogo from "../../assest/logo.png";
import api from "../../api/axios";

export const getSafeAssetUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  if (raw.startsWith("data:")) {
    return raw;
  }

  const apiBaseUrl = String(api.defaults.baseURL || "").trim();
  const apiOrigin = apiBaseUrl ? new URL(apiBaseUrl).origin : window.location.origin;
  const normalizedPath = raw.startsWith("/") ? raw : `/${raw}`;

  try {
    return new URL(normalizedPath, apiOrigin).toString();
  } catch {
    return "";
  }
};

const InfoGrid = ({ title, items }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {value || "-"}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export const StudentProfileSheet = ({ student, onStudentUpdated }) => {
  const feeTotals = getFeeTotals(student || {});
  const documents = Array.isArray(student?.documents) ? student.documents : [];
  const [deletingUrl, setDeletingUrl] = React.useState("");

  const handleDeleteDocument = async (documentUrl) => {
    if (!student?._id || !documentUrl) return;
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

      const response = await api.put(`/student/profile/update/${student._id}`, payload);
      if (response.data?.success) {
        onStudentUpdated?.(response.data.student);
      }
    } catch (error) {
      window.alert(error.response?.data?.message || "Unable to delete document");
    } finally {
      setDeletingUrl("");
    }
  };

  return (
    <div className="bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 px-6 py-6 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-5">
              <div className="h-28 w-24 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
                {getSafeAssetUrl(student?.imgSrc) ? (
                  <img
                    src={getSafeAssetUrl(student?.imgSrc)}
                    alt={student?.name || "Student"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl font-black">
                    {String(student?.name || "S").charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
                  Student Profile
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight">
                  {student?.name || "Student"}
                </h1>
                <p className="mt-2 text-sm text-slate-300">
                  {student?.course || "-"} {student?.semester ? `• Semester ${student.semester}` : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    WRN: {student?.wrn || "-"}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    Enrollment: {student?.enrollment || "-"}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    Section: {student?.section || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Total Fees</p>
                <p className="mt-1 text-xl font-black">₹ {feeTotals.total}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Paid Fees</p>
                <p className="mt-1 text-xl font-black">₹ {feeTotals.paid}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Pending</p>
                <p className="mt-1 text-xl font-black">₹ {feeTotals.pending}</p>
              </div>
            </div>
          </div>
        </section>

        <InfoGrid
          title="Academic Details"
          items={[
            ["Roll No", student?.rollno],
            ["Course", student?.course],
            ["Semester", student?.semester],
            ["Section", student?.section],
            ["Branch", student?.branch],
            ["Reference", student?.reference],
            ["WRN", student?.wrn],
            ["Enrollment", student?.enrollment],
            ["Date of Admission", student?.doa ? new Date(student.doa).toLocaleDateString("en-IN") : "-"],
          ]}
        />

        <InfoGrid
          title="Personal Details"
          items={[
            ["Father Name", student?.fathername],
            ["Mother Name", student?.mothername],
            ["Date of Birth", student?.dob ? new Date(student.dob).toLocaleDateString("en-IN") : "-"],
            ["Aadhaar", student?.adhaar],
            ["Mobile 1", student?.mobile1],
            ["Mobile 2", student?.mobile2],
            ["Mobile 3", student?.mobile3],
            ["Email", student?.email],
          ]}
        />

        <InfoGrid
          title="Address Details"
          items={[
            ["Address", student?.address],
            ["Landmark", student?.landmark],
            ["Post", student?.post],
            ["District", student?.district],
            ["Pincode", student?.pincode],
          ]}
        />

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Fee Breakdown</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {feeTotals.list.map((item) => (
              <div key={item.key} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span>Total</span>
                    <span className="font-semibold">₹ {item.total}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Paid</span>
                    <span className="font-semibold text-emerald-700">₹ {item.paid}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Pending</span>
                    <span className="font-semibold text-rose-700">₹ {item.pending}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">Documents</h3>
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

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                    {documentItem.type}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <a
                      href={getSafeAssetUrl(documentItem.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Open File
                    </a>
                    {onStudentUpdated ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(documentItem.url)}
                        disabled={deletingUrl === documentItem.url}
                        className="text-sm font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                      >
                        {deletingUrl === documentItem.url ? "Deleting..." : "Delete"}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                No documents uploaded
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
const COLLEGE_NAME = "Shaluntala Krishna Institute of Technology";

const formatPrintDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-IN");
};

const escapeHtml = (value) =>
  String(value ?? "-")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderPrintField = (label, value) => `
  <div class="field-card">
    <div class="field-label">${escapeHtml(label)}</div>
    <div class="field-value">${escapeHtml(value || "-")}</div>
  </div>
`;

const isPreviewableImage = (url) => {
  const safeUrl = getSafeAssetUrl(url);
  if (!safeUrl) return false;
  const lower = safeUrl.toLowerCase();
  return (
    lower.startsWith("data:image/") ||
    [".png", ".jpg", ".jpeg", ".webp", ".gif"].some((ext) =>
      lower.includes(ext),
    )
  );
};

const getPrintHtml = (student, options) => {
 
  const safeSignature =
    options.includeSignature ? getSafeAssetUrl(student?.signature) : "";
  const documents = Array.isArray(student?.documents) ? student.documents : [];
  const printableDocuments = options.includeDocuments ? documents : [];

  const academicFields = [
    ["Student Name", student?.name],
    ["WRN", student?.wrn],
    ["Roll No", student?.rollno],
    ["Enrollment", student?.enrollment],
    ["Course", student?.course],
    ["Semester", student?.semester],
    ["Section", student?.section],
    ["Branch", student?.branch],
    ["Reference", student?.reference],
    ["Admission Date", formatPrintDate(student?.doa)],
  ];

  const personalFields = [
    ["Father Name", student?.fathername],
    ["Mother Name", student?.mothername],
    ["Date of Birth", formatPrintDate(student?.dob)],
    ["Aadhaar", student?.adhaar],
    ["Email", student?.email],
    ["Mobile 1", student?.mobile1],
    ["Mobile 2", student?.mobile2],
    ["Mobile 3", student?.mobile3],
  ];

  const addressFields = [
    ["Address", student?.address],
    ["Landmark", student?.landmark],
    ["Post", student?.post],
    ["District", student?.district],
    ["Pincode", student?.pincode],
  ];

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Student Profile</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        color: #0f172a;
        background: #e2e8f0;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: #ffffff;
        padding: 18mm 16mm;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 18px;
        padding-bottom: 16px;
        border-bottom: 3px solid #0f172a;
      }
      .logo {
        width: 84px;
        height: 84px;
        object-fit: contain;
      }
      .header-copy {
        flex: 1;
      }
      .college-name {
        font-size: 26px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .doc-title {
        margin-top: 6px;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #475569;
      }
      .hero {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        margin-top: 18px;
        padding: 18px;
        border: 1px solid #cbd5e1;
        border-radius: 16px;
        background: #f8fafc;
      }
      .hero-main h1 {
        margin: 0;
        font-size: 30px;
      }
      .hero-meta {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .pill {
        padding: 8px 12px;
        border: 1px solid #cbd5e1;
        border-radius: 999px;
        background: #ffffff;
        font-size: 12px;
        font-weight: 600;
      }
      .hero-photo {
        width: 118px;
        min-width: 118px;
        height: 140px;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid #cbd5e1;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hero-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .section {
        margin-top: 18px;
      }
      .section-title {
        margin: 0 0 10px 0;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .field-card {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 12px;
        background: #ffffff;
      }
      .field-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #64748b;
      }
      .field-value {
        margin-top: 6px;
        font-size: 14px;
        font-weight: 600;
        word-break: break-word;
      }
      .signature-box {
        margin-top: 18px;
        width: 220px;
        margin-left: auto;
        text-align: center;
      }
      .signature-box img {
        width: 100%;
        height: 80px;
        object-fit: contain;
        border-bottom: 1px solid #94a3b8;
      }
      .signature-label {
        margin-top: 6px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #475569;
      }
      .documents {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .document-card {
        border: 1px solid #cbd5e1;
        border-radius: 14px;
        padding: 12px;
        background: #f8fafc;
      }
      .document-card img {
        margin-top: 10px;
        width: 100%;
        max-height: 220px;
        object-fit: contain;
        border-radius: 10px;
        background: #ffffff;
      }
      .document-type {
        font-size: 13px;
        font-weight: 700;
      }
      .document-url {
        margin-top: 8px;
        font-size: 11px;
        color: #475569;
        word-break: break-all;
      }
      @media print {
        body {
          background: #ffffff;
        }
        .page {
          width: auto;
          min-height: auto;
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <img class="logo" src="${collegeLogo}" alt="College Logo" />
        <div class="header-copy">
          <div class="college-name">${escapeHtml(COLLEGE_NAME)}</div>
          <div class="doc-title">Student Profile Sheet</div>
        </div>
      </div>

      <div class="hero">
        <div class="hero-main">
          <h1>${escapeHtml(student?.name || "Student")}</h1>
          <div class="hero-meta">
            <span class="pill">WRN: ${escapeHtml(student?.wrn || "-")}</span>
            <span class="pill">Enrollment: ${escapeHtml(student?.enrollment || "-")}</span>
            <span class="pill">Course: ${escapeHtml(student?.course || "-")}</span>
            <span class="pill">Section: ${escapeHtml(student?.section || "-")}</span>
          </div>
        </div>
        ${
           `<div class="hero-photo"><img src="${student?.imgSrc}" alt="Student Photo" /></div>`
            
        }
      </div>

      <div class="section">
        <h2 class="section-title">Academic Details</h2>
        <div class="grid">
          ${academicFields.map(([label, value]) => renderPrintField(label, value)).join("")}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Personal Details</h2>
        <div class="grid">
          ${personalFields.map(([label, value]) => renderPrintField(label, value)).join("")}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Address Details</h2>
        <div class="grid">
          ${addressFields.map(([label, value]) => renderPrintField(label, value)).join("")}
        </div>
      </div>

      ${
        printableDocuments.length
          ? `
      <div class="section">
        <h2 class="section-title">Documents</h2>
        <div class="documents">
          ${printableDocuments
            .map(
              (documentItem, index) => `
            <div class="document-card">
              <div class="document-type">${escapeHtml(
                documentItem?.type || `Document ${index + 1}`,
              )}</div>
              ${
                isPreviewableImage(documentItem?.url)
                  ? `<img src="${getSafeAssetUrl(documentItem.url)}" alt="${escapeHtml(
                      documentItem?.type || `Document ${index + 1}`,
                    )}" />`
                  : `<div class="document-url">${escapeHtml(documentItem?.url || "File attached")}</div>`
              }
            </div>`,
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      ${
        safeSignature
          ? `
      <div class="signature-box">
        <img src="${safeSignature}" alt="Signature" />
        <div class="signature-label">Student Signature</div>
      </div>`
          : ""
      }
    </div>
  </body>
</html>`;
};

export const printStudentProfile = (student) => {
 
  const includeSignature = window.confirm(
    "Are you want to include Student Signature ?",
  );
  const includeDocuments = window.confirm(
    "Are you want to include Document ?",
  );

  const printWindow = window.open("", "_blank", "width=1400,height=900");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(
    getPrintHtml(student, {
      includeSignature,
      includeDocuments,
    }),
  );
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 700);
};

export default StudentProfileSheet;
