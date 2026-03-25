import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getFeeTotals } from "../../utils/studentFees";

export const getSafeAssetUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return raw;
  if (raw.startsWith("data:image/")) return raw;
  return "";
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

export const StudentProfileSheet = ({ student }) => {
  const feeTotals = getFeeTotals(student || {});
  const documents = Array.isArray(student?.documents) ? student.documents : [];

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
                <a
                  key={`${documentItem.type}-${index}`}
                  href={documentItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Document
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {documentItem.type}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-blue-700">
                    Open File
                  </p>
                </a>
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

const getPrintHtml = (student) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Student Profile</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>${renderToStaticMarkup(<StudentProfileSheet student={student} />)}</body>
</html>`;

export const printStudentProfile = (student) => {
  const printWindow = window.open("", "_blank", "width=1400,height=900");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(getPrintHtml(student));
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 700);
};

export default StudentProfileSheet;
