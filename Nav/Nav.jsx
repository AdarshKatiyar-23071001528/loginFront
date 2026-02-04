import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import {Link} from 'react-router-dom';
import AppContext from "../src/Context/AppContext";
const Nav = () => {
  
  const [login, setlogin] = useState(true);

  const [showmenu, setShowmenu] = useState(false);
  const {userLogin} = useContext(AppContext);

  const handleButtonToggle = () => {
    setShowmenu(!showmenu);
  };

  return (
    <>
     <header className="h-[90px]  w-full shadow-[0_10px_25px_rgba(45,120,10,0.5)]">
  <div className=" w-full h-full flex items-center justify-between nav-container">

    <div className="h-full flex items-center px-6 logo">
      <h1 title="Shakuntala Krishna Institute Of Technology"><Link to={'/'} className="skit">SKIT</Link></h1>
    </div>

    <nav className="h-full nav-bar">
      <ul className="flex h-full items-center gap-5 text-red-400">
        <Link to={'/carrer'} className="link">Carrer</Link>
        <Link to={'/contact'} className="link">Contact</Link>
        <Link to={'/course'}  className="link">Course</Link>
       
        {userLogin ?  <Link to={"/users"} className="link">All Users</Link> : ""}
        <Link to={"/login"} className="link">Login</Link>
        
        
      </ul>
    </nav>

  </div>
</header>

    </>
  );
};

export default Nav;
