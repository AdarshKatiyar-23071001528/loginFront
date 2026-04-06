import React, { useEffect, useMemo, useState } from "react";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"];
const PDF_HINTS = [".pdf", "/raw/upload/", "resource_type=raw", "application/pdf"];

const isPdfSource = (url = "", file = null) => {
  const fileName = String(file?.name || "").toLowerCase();
  const fileType = String(file?.type || "").toLowerCase();
  const safeUrl = String(url || "").toLowerCase();

  return (
    fileType === "application/pdf" ||
    fileName.endsWith(".pdf") ||
    PDF_HINTS.some((hint) => safeUrl.includes(hint))
  );
};

const isImageSource = (url = "", file = null) => {
  const fileName = String(file?.name || "").toLowerCase();
  const fileType = String(file?.type || "").toLowerCase();
  const safeUrl = String(url || "").toLowerCase();

  return (
    fileType.startsWith("image/") ||
    IMAGE_EXTENSIONS.some((extension) => fileName.endsWith(extension)) ||
    safeUrl.startsWith("data:image/") ||
    IMAGE_EXTENSIONS.some((extension) => safeUrl.includes(extension))
  );
};

const DocumentPreview = ({
  file = null,
  url = "",
  openUrl = "",
  title = "Document preview",
  className = "",
  emptyMessage = "Preview not available",
}) => {
  const [objectUrl, setObjectUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setObjectUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setObjectUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [file]);

  const previewUrl = useMemo(() => objectUrl || url || "", [objectUrl, url]);
  const actionUrl = useMemo(() => objectUrl || openUrl || url || "", [objectUrl, openUrl, url]);

  if (!previewUrl) {
    return (
      <div
        className={`flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500 ${className}`}
      >
        {emptyMessage}
      </div>
    );
  }

  if (isPdfSource(previewUrl, file)) {
    return (
      <div
        className={`flex min-h-56 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50 via-white to-slate-50 px-4 py-6 text-center ${className}`}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-100 text-3xl font-black text-rose-700">
          PDF
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-2 text-xs text-slate-500">PDF document available. Open it in a new tab for full view.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href={actionUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open PDF
          </a>
          <a
            href={actionUrl}
            download
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Download
          </a>
        </div>
      </div>
    );
  }

  if (isImageSource(previewUrl, file)) {
    return (
      <img
        src={previewUrl}
        alt={title}
        className={`h-56 w-full rounded-2xl border border-slate-200 bg-white object-contain ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 ${className}`}
    >
      <p>{emptyMessage}</p>
      <a
        href={actionUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Open file
      </a>
    </div>
  );
};

export default DocumentPreview;
