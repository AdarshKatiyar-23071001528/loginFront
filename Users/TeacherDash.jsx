import React, { useState, useContext } from 'react';
import TeacherAttendance from './TeacherAttendance';
import AppContext from '../src/Context/AppContext';
import { useNavigate } from 'react-router-dom';

const TeacherDash = () => {
  const { login } = useContext(AppContext); // actually teacherLogin will be used
  const { teacherLogin } = useContext(AppContext);
  const [teacher, setTeacher] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await teacherLogin(email, password);
    if (res.success) {
     
      setTeacher(res.teacher);
    }
  };

  if (!teacher) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Teacher Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <input
            className="border p-1"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-1"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-3 mt-2">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold bg-red-400">Welcome {teacher.name}</h2>
      <TeacherAttendance teacherId={teacher._id} />
    </div>
  );
};

export default TeacherDash;