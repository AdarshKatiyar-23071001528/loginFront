import React, { useEffect, useMemo, useState } from "react";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"];


const isPdfSource = (url = "", file = null) => {
  const fileName = String(file?.name || "").toLowerCase();
  const fileType = String(file?.type || "").toLowerCase();
  const safeUrl = String(url || "").toLowerCase();

  return (
    fileType === "application/pdf" ||
    fileName.endsWith(".pdf") ||
    safeUrl.includes(".pdf")
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
        className={`flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center ${className}`}
      >
        <p className="text-sm font-semibold text-slate-700">PDF preview is not available inline.</p>
        <p className="text-xs text-slate-500">
          Open or download the file in a new tab.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open PDF
          </a>
          <a
            href={previewUrl}
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
      className={`flex min-h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 ${className}`}
    >
      {emptyMessage}
    </div>
  );
};

export default DocumentPreview;


