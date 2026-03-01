import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../src/Context/AppContext';

const SubjectManagement = () => {
  const { createSubject, assignTeacher, getTeachers, getSubjects } = useContext(AppContext);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: '', course: 'BBA', semester: 1, section: 'A' });
  const [assign, setAssign] = useState({ subjectId: '', teacherId: '' });

  useEffect(() => {
    const load = async () => {
      let res = await getSubjects();
      if (res.success) setSubjects(res.subjects);
      res = await getTeachers();
      if (res.success) setTeachers(res.teachers);
    };
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await createSubject(form);
    alert(res.message);
    if (res.success) setSubjects([...subjects, res.subject]);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const res = await assignTeacher(assign);
    alert(res.message);
    if (res.success) {
      const updated = subjects.map((s) =>
        s._id === res.subject._id ? res.subject : s
      );
      setSubjects(updated);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Subject Management</h2>
      <form onSubmit={handleCreate} className="mb-6">
        <input
          className="border p-1 mr-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          className="border p-1 mr-2"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        >
          <option value="BBA">BBA</option>
          <option value="BCA">BCA</option>
        </select>
        <input
          type="number"
          className="border p-1 mr-2 w-16"
          min={1}
          max={6}
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
        />
        <input
          className="border p-1 mr-2 w-16"
          placeholder="Section"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-3">Create</button>
      </form>

      <form onSubmit={handleAssign} className="mb-6">
        <select
          className="border p-1 mr-2"
          value={assign.subjectId}
          onChange={(e) => setAssign({ ...assign, subjectId: e.target.value })}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {`${s.name} (${s.course} S${s.semester}${s.section})`}
            </option>
          ))}
        </select>
        <select
          className="border p-1 mr-2"
          value={assign.teacherId}
          onChange={(e) => setAssign({ ...assign, teacherId: e.target.value })}
        >
          <option value="">Select Teacher</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
        <button className="bg-green-500 text-white px-3">Assign</button>
      </form>

      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Sem</th>
            <th>Sec</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.course}</td>
              <td>{s.semester}</td>
              <td>{s.section}</td>
              <td>{s.teacher?.name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectManagement;