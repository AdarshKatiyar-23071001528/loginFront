import React, { useContext, useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import AppContext from "../src/Context/AppContext";
import logo from "../src/assest/logo.png"

const Nav = () => {
  const { userLogin } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="h-[90px] w-full shadow-lg bg-black/30 backdrop-blur p-4 fixed z-19">
      <div className="h-full flex items-center justify-between px-6">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold ">
        <img src={logo} alt=""className="h-[70px] opacity-75" title="Shankutla Krishna Institute of Technology" />
          {/* <h1 title="Shankutla Krishna Institute of Technology">SKIT</h1> */}

        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-lg ">
          <Link to="/carrer" className="link text-white">Career</Link>
          <Link to="/contact" className="link  text-white">Contact</Link>
          <Link to="/course" className="link  text-white">Course</Link>
          {userLogin && <Link to="/users" className="link  text-white">All Users</Link>}
          {/* <Link to="" className="link">Register</Link> */}
          <Link to="/login" className="link  text-white">Login</Link>
        </nav>

        {/* Hamburger */}
        <button
          className="ham-menu md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          <GiHamburgerMenu />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          ref={menuRef}
          className="mob md:hidden fixed top-[90px] left-0 w-full border-t z-50"
        >
          <ul className="flex flex-col items-center gap-6 py-6 text-lg">
            <Link to="/carrer" className="link">Career</Link>
            <Link to="/contact" className="link">Contact</Link>
            <Link to="/course" className="link">Course</Link>
            {userLogin && <Link to="/users" className="link">All Users</Link>}
            <Link to="/login" className="link">Login</Link>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
