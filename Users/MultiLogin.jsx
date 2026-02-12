import React from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { PiStudentBold } from "react-icons/pi";
import { Link } from "react-router-dom";

const MultiLogin = () => {
  return (
    <>
      <div className="logBox w-full h-full flex justify-center items-center">
        <div className="allLog h-full md:h-70  w-full md:w-130 flex md:flex-row justify-around items-center">
          <div className="admin">
            <div className="alog">
            
              <Link to={"/admin/login"}>
                <MdAdminPanelSettings size={50} />
                <label htmlFor="">Admin</label>
              </Link>
            </div>
          </div>
          <div className="teacher">
            <div className="alog">
            
              <Link to={"/faculty/login"}>
              <GiTeacher size={50} />
              <label htmlFor="">Teacher</label>
              </Link>
            </div>
          </div>
          <div className="student">
            <div className="alog">
           
              <Link to={"/student/login"}>
              <PiStudentBold size={50} />
              <label htmlFor="">Student</label>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiLogin;
