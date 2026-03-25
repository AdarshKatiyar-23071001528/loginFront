export const DOCUMENT_TYPE_OPTIONS = [
  { value: "Aadhaar Card", label: "Aadhaar Card" },
  { value: "Transfer Certificate", label: "Transfer Certificate" },
  { value: "Character Certificate", label: "Character Certificate" },
  { value: "custom", label: "New Document" },
];

export const createDocumentItem = (overrides = {}) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type: "",
  customType: "",
  file: null,
  url: "",
  ...overrides,
});

export const resolveDocumentType = (documentItem = {}) => {
  if (documentItem.type === "custom") {
    return String(documentItem.customType || "").trim();
  }
  return String(documentItem.type || "").trim();
};

export const normalizeStudentDocuments = (documents = []) => {
  if (!Array.isArray(documents) || documents.length === 0) {
    return [createDocumentItem()];
  }

  return documents.map((item) =>
    createDocumentItem({
      type: DOCUMENT_TYPE_OPTIONS.some((option) => option.value === item?.type)
        ? item.type
        : item?.type
          ? "custom"
          : "",
      customType: DOCUMENT_TYPE_OPTIONS.some((option) => option.value === item?.type)
        ? ""
        : item?.type || "",
      url: item?.url || "",
    }),
  );
};
