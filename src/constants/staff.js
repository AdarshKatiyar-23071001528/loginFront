export const STAFF_ROLES = [
  { value: "teacher", label: "Teacher" },
  { value: "accountant", label: "Accountant" },
  { value: "manager", label: "Manager" },
  { value: "support", label: "Support" },
  { value: "admin_staff", label: "Admin Staff" },
];

export const STAFF_PERMISSION_OPTIONS = [
  { value: "attendance.manage", label: "Attendance Management" },
  { value: "marks.manage", label: "Marks Management" },
  { value: "students.read", label: "Student Record" },
  { value: "students.manage", label: "Add Student" },
  { value: "teachers.read", label: "Teacher Record" },
  { value: "teachers.manage", label: "Add Teacher" },
  { value: "payments.dashboard", label: "Payment Dashboard" },
  { value: "payments.collect", label: "Pay Fees" },
  { value: "payments.history", label: "Payment History" },
  { value: "payments.pending", label: "Pending Fees" },
  { value: "payments.requests", label: "Pending Request" },
  { value: "expenses.manage", label: "Expense" },
  { value: "subjects.manage", label: "Subject" },
  { value: "notices.manage", label: "Notice" },
  { value: "subjects.read", label: "Subjects Access" },
  { value: "payments.read", label: "Payments Read" },
  { value: "payments.manage", label: "Payments Management" },
  { value: "messages.manage", label: "Message Management" },
  { value: "staff.manage", label: "Staff Access Control" },
];

export const ALL_STAFF_PERMISSIONS = STAFF_PERMISSION_OPTIONS.map((item) => item.value);
