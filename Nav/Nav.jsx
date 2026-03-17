import React, { useContext, useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import AppContext from "../src/Context/AppContext";
import logo from "../src/assest/logo.png"

const Nav = () => {
  const { userLogin } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/30">
      <div className="ui-container flex h-[72px] items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="SKIT" className="h-11 w-auto opacity-90" title="Shakuntala Krishna Institute of Technology" />
          {/* <h1 title="Shankutla Krishna Institute of Technology">SKIT</h1> */}

        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-2 md:flex">
          {[
            { to: "/carrer", label: "Career" },
            { to: "/contact", label: "Contact" },
            { to: "/course", label: "Courses" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          {userLogin ? (
            <Link
              to="/users"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              All Users
            </Link>
          ) : null}

          <Link to="/login" className="ui-btn ui-btn-primary ml-2">
            Login
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          className="rounded-xl p-2 text-2xl text-white/90 transition hover:bg-white/10 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <GiHamburgerMenu />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          ref={menuRef}
          className="md:hidden"
        >
          <div className="border-t border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="ui-container flex flex-col gap-1 py-3">
              {[
                { to: "/carrer", label: "Career" },
                { to: "/contact", label: "Contact" },
                { to: "/course", label: "Courses" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {userLogin ? (
                <Link
                  to="/users"
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  All Users
                </Link>
              ) : null}

              <Link to="/login" className="ui-btn ui-btn-primary mt-2 w-full justify-center" onClick={() => setOpen(false)}>
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
