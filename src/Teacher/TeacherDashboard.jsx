import React, { use, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import api from '../api/axios';
import TeacherAttendance from '../../Users/TeacherAttendance';

const TeacherDashboard = () => {

    const location = useLocation();
    const {id} = useParams();
    let [teacher, setTeacher] = useState(null);
    

  useEffect( () =>{
     const fetchTeacherData = async() =>{
      try {
        const response = await api.get(`/teacher/profile/${id}`);
        const teacherData = response.data.teacher;
        setTeacher(teacherData);
        
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
     }
     if(id){
      fetchTeacherData();
     }
  },[id])

  return (

    <div>Welcome {teacher ? teacher.name : 'Teacher'}


    
    <TeacherAttendance teacherId={id} />

    </div>
  )
    
}

export default TeacherDashboard