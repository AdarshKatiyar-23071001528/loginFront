export const FEE_TYPE_OPTIONS = [
  { value: "tuition", label: "Tuition Fees" },
  { value: "convenience", label: "Convenience Fees" },
  { value: "hostel", label: "Hostel Fees" },
  { value: "documents", label: "Documents Fees" },
  { value: "other", label: "Other Fees" },
];

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

export const getStudentFeeSummary = (student = {}) => {
  const summary = {
    tuition: {
      label: "Tuition Fees",
      total: Math.max(toAmount(student.fees) - toAmount(student.discount), 0),
      paid: toAmount(student.paidfees),
    },
    convenience: {
      label: "Convenience Fees",
      total: toAmount(student.convenienceFees),
      paid: toAmount(student.paidConvenienceFees),
    },
    hostel: {
      label: "Hostel Fees",
      total: toAmount(student.hostelFees),
      paid: toAmount(student.paidHostelFees),
    },
    documents: {
      label: "Documents Fees",
      total: toAmount(student.documentFees),
      paid: toAmount(student.paidDocumentFees),
    },
    other: {
      label: "Other Fees",
      total: toAmount(student.otherFees),
      paid: toAmount(student.paidOtherFees),
    },
  };

  Object.values(summary).forEach((item) => {
    item.pending = Math.max(item.total - item.paid, 0);
  });

  return summary;
};

export const getFeeTotals = (student = {}) => {
  const summary = getStudentFeeSummary(student);
  const list = Object.entries(summary).map(([key, value]) => ({
    key,
    ...value,
  }));

  return {
    summary,
    list,
    total: list.reduce((sum, item) => sum + item.total, 0),
    paid: list.reduce((sum, item) => sum + item.paid, 0),
    pending: list.reduce((sum, item) => sum + item.pending, 0),
  };
};
