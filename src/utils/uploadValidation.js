export const UPLOAD_LIMITS = {
  image: 50 * 1024,
  signature: 50 * 1024,
  document: 250 * 1024,
};

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const DOCUMENT_MIME_TYPES = [...IMAGE_MIME_TYPES, "application/pdf"];

export const formatFileSize = (bytes) => {
  if (bytes >= 1024 * 1024) {
    return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
};

export const validateUploadFile = (file, kind = "document") => {
  if (!file) return "";

  const maxSize =
    kind === "image"
      ? UPLOAD_LIMITS.image
      : kind === "signature"
        ? UPLOAD_LIMITS.signature
        : UPLOAD_LIMITS.document;

  const allowedTypes =
    kind === "document" ? DOCUMENT_MIME_TYPES : IMAGE_MIME_TYPES;

  if (!allowedTypes.includes(file.type)) {
    return kind === "document"
      ? "Only PDF, JPG, PNG, or WEBP files are allowed"
      : "Only JPG, PNG, or WEBP images are allowed";
  }

  if (file.size > maxSize) {
    return `${kind} must be ${formatFileSize(maxSize)} or smaller`;
  }

  return "";
};
