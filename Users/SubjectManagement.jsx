import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../src/Context/AppContext';

const SubjectManagement = () => {
  const { createSubject, assignTeacher, getTeachers, getSubjects } = useContext(AppContext);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: '', course: '', semester: '', section: '' });
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
    <div className='flex flex-col w-full h-[100vh]  p-3 bg-red-100 rounded'>
      <p className="text-4xl font-bold mb-4">Subject Management</p>



      <div className=' w-full flex items-center justify-center flex-col gap-4 mb-4'>


        <div className='w-full bg-gray-100 p-3 rounded shadow' >
          <p className='font-bold text-2xl '>Add Subject</p>
           <form onSubmit={handleCreate} className="flex justify-between">
        
        <div className='rounded '>
         
          <input
          className="border-gray-700 border outline-none p-2 mr-2 rounded border-1"
          placeholder="Create Subject "
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        </div>
       
        <div className='flex items-center border border-gray-500 rounded'>
              
        <select
          className=" p-2 mr-2 outline-none"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        >
          <option disabled selected>Choose Class</option>
          <option value="BBA">BBA</option>
          <option value="BCA">BCA</option>
        </select>
        </div>

        <div className='items-center  flex border border-gray-500 rounded px-3'>
          
             <input
          type="number"
          className="w-23 text-center outline-none"
          min={1}
          max={6}
          value={form.semester}
          placeholder='Semester'
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
        />
        </div>
       
       
       <div className='items-center flex border border-gray-500 rounded px-4'>
       
            <input
          className="w-30 text-center outline-none"
          placeholder="Choose Section"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
        />
       </div>
        
        <button className="bg-blue-500 text-white px-4 rounded">Create</button>



            </form>
        </div>



        <div className='w-full p-3 bg-gray-100  rounded shadow'>
           <p className='font-bold text-2xl'>Assign Teacher</p>
          <form onSubmit={handleAssign} className="mb-6 flex justify-between">

            <div className='flex gap-4'>
                 <div className=''>
        <select
          className="border p-2 mr-2 outline-none rounded border-gray-400 border-1"
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
            </div>
        
        <div className=''><select
          className="border p-2 mr-2 outline-none rounded border-gray-400 border-1 w-[200px]"
          value={assign.teacherId}
          onChange={(e) => setAssign({ ...assign, teacherId: e.target.value })}
        >
          <option value="">Select Teacher</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select></div>
            </div>
           
        
        <button className="bg-green-500 text-white px-4 rounded ">Assign</button>
      </form>
        </div>

      </div>
          
      
          <div className='h-[300px] overflow-scroll'>
               <table className="w-full text-left">
        <thead>
          <tr>
            <th>Subject Name</th>
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
     
    </div>
  );
};

export default SubjectManagement;