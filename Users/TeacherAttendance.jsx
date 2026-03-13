import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../src/Context/AppContext';

const TeacherAttendance = ({ teacherId }) => {
  const {
    subjectsByTeacher,
    studentsForSubject,
    markAttendance,
  } = useContext(AppContext);

  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState('');
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});

  useEffect(() => {
    const loadSubjects = async () => {
      const res = await subjectsByTeacher(teacherId);
      if (res.success) setSubjects(res.subjects);
    };
    loadSubjects();
  }, [teacherId]);

  const fetchStudents = async () => {
    if (!selected) return;
    const res = await studentsForSubject(selected);
    if (res.success) {
      setStudents(res.students);
      const map = {};
      res.students.forEach((s) => (map[s._id] = 'present'));
      setRecords(map);
      
    }
  };
  
  const handleMark = async () => {
    const recs = students.map((s) => ({ studentId: s._id, status: records[s._id] }));
    const res = await markAttendance({ subjectId: selected, records: recs, teacherId });
    console.log(res);
    alert(res.message);
    
  };
  console.log(records)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
      <select
        className="border p-1 mb-4"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        onBlur={fetchStudents}
      >
        <option value="">Select subject</option>
        {subjects.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name} ({s.course} S{s.semester}{s.section})
          </option>
        ))}
      </select>
      {students.length > 0 && (
        <>
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.rollno}</td>
                  <td>
                    <select
                      value={records[s._id]}
                      onChange={(e) =>
                        setRecords({ ...records, [s._id]: e.target.value })
                      }
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="bg-blue-500 text-white px-3 mt-4" onClick={handleMark}>
            Save
          </button>
        </>
      )}

    </div>
  );
};

export default TeacherAttendance;