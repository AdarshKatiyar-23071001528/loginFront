import React from "react";
import StudentProfileSheet, {
  printStudentProfile,
} from "../components/student/StudentProfileSheet";

const ViewStudent = ({ student, onClose, onEdit, onStudentUpdated }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Student Details
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">
              {student.name || "Student"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onEdit?.(student)}
              className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => printStudentProfile(student)}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <StudentProfileSheet
            student={student}
            onStudentUpdated={onStudentUpdated}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
