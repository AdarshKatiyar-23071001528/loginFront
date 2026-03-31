import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaAward,
  FaBook,
  FaBriefcase,
  FaBuildingColumns,
  FaChalkboardUser,
  FaChartLine,
  FaGraduationCap,
  FaUsers,
} from "react-icons/fa6";

import StatsCard from "./StatsCard";
import Admission from "../src/components/Admission/Admission";

const Home = () => {


  const[newAdmission, setNewAdmission] = useState(false);
  const text = "Welcome to SKIT 🎓";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const chars = Array.from(text);
    if (index < chars.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + chars[index]);
        setIndex(index + 1);
      }, 120);

      return () => clearTimeout(timeout);
    }
  }, [index]);

  console.log(newAdmission)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-900 pt-28 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 right-[-40px] h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>

        <div className="ui-container relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-inset ring-white/15">
              <FaBuildingColumns />
              Shakuntala Krishna Institute of Technology
            </div>

            <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                {displayText}
              </span>
              <span className="ml-1 inline-block animate-pulse align-baseline text-white/80">|</span>
            </h1>

            <p className="mt-6 text-pretty text-base text-white/80 sm:text-lg">
              Your gateway to world-class education. Learn from experienced faculty, build real-world skills, and
              accelerate your career with a modern curriculum.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/login" className="ui-btn ui-btn-primary">
                Login Portal <FaArrowRight />
              </Link>
              <Link
                // to="/student/register"
                className="ui-btn ui-btn-secondary bg-white/10 text-white ring-white/20 hover:bg-white/15"
                onClick={() => setNewAdmission(true) }
              >
                New Admission
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 md:py-16">
        <div className="ui-container">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard label="Students Enrolled" value="500+" icon={FaUsers} accent="indigo" helper="Active learners" />
            <StatsCard
              label="Expert Faculty"
              value="200+"
              icon={FaChalkboardUser}
              accent="emerald"
              helper="Mentors & educators"
            />
            <StatsCard label="Courses" value="50+" icon={FaBook} accent="amber" helper="Industry-aligned" />
            <StatsCard label="Placement Rate" value="95%" icon={FaChartLine} accent="rose" helper="Career outcomes" />
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="ui-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Why Choose SKIT</h2>
            <p className="mt-4 text-slate-600">A learning experience designed for outcomes: skills, mentorship, and opportunities.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FaChalkboardUser,
                title: "Expert Faculty",
                description: "Learn from experienced educators and industry professionals.",
              },
              {
                icon: FaBook,
                title: "Modern Curriculum",
                description: "Courses updated with relevant tools and real-world projects.",
              },
              {
                icon: FaBriefcase,
                title: "Career Support",
                description: "Guidance for internships, placements, and interview preparation.",
              },
              {
                icon: FaAward,
                title: "Certifications",
                description: "Boost credibility with recognized certifications and training.",
              },
              {
                icon: FaUsers,
                title: "Community",
                description: "Collaborate with peers, mentors, and alumni network.",
              },
              {
                icon: FaGraduationCap,
                title: "Global Recognition",
                description: "Build a profile that stands out across industries and regions.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="ui-card ui-card-hover p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100">
                    {React.createElement(Icon, { className: "text-xl" })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="ui-container">
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Popular Courses</h2>
              <p className="mt-2 text-slate-600">Explore programs tailored for today’s careers.</p>
            </div>
            <Link to="/course" className="ui-btn ui-btn-secondary">
              View all <FaArrowRight />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Computer Science", meta: "12 subjects" },
              { title: "Business Administration", meta: "10 subjects" },
              { title: "Engineering", meta: "15 subjects" },
              { title: "Arts & Science", meta: "20 subjects" },
              { title: "Commerce", meta: "8 subjects" },
              { title: "Management", meta: "9 subjects" },
            ].map((course) => (
              <div key={course.title} className="ui-card ui-card-hover overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-6 text-white">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{course.meta}</p>
                </div>
                <div className="p-6">
                  <Link to="/course" className="ui-btn ui-btn-secondary w-full justify-center">
                    Explore <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-900 py-16 text-white">
        <div className="ui-container">
          <div className="ui-card border-white/10 bg-white/5 p-8 text-center ring-1 ring-inset ring-white/10 md:p-12">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Ready to transform your future?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">Start learning today and build the skills that employers look for.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/student/register" className="ui-btn ui-btn-primary">
                Register <FaArrowRight />
              </Link>
              <Link to="/contact" className="ui-btn ui-btn-secondary bg-white/10 text-white ring-white/20 hover:bg-white/15">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 py-10">
        <div className="ui-container">
          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:text-left">
            {[
              { value: "24/7", label: "Online Learning" },
              { value: "100%", label: "Flexible Schedule" },
              { value: "∞", label: "Lifetime Access" },
            ].map((item) => (
              <div key={item.label} className="ui-card p-6">
                <div className="text-3xl font-semibold text-slate-900">{item.value}</div>
                <div className="mt-1 text-sm text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center text-sm text-slate-500">© 2026 SKIT. All rights reserved.</div>
        </div>
      </footer>




      {newAdmission && (
      <div className="inset-0 flex flex-col fixed bg-black/40 h-screen w-screen justify-center items-center z-90">
          <p className="text-red flex justify-end bg-white w-[400px] rounded-t-xl pr-5 pt-2" onClick={() => setNewAdmission(false)}>Cross</p>
           <Admission/>
      </div>
       
      )}
    </>
  );
};

export default Home;
