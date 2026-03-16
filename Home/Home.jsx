import React, { useEffect, useState } from "react";
import {
  FaGraduationCap,
  FaUsers,
  FaBriefcase,
  FaAward,
  FaChalkboardUser,
  FaBook
} from "react-icons/fa6";

import "./Home.css";

const Home = () => {

  const text = "Welcome to SKIT 🎓";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {

      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[index]);
        setIndex(index + 1);
      }, 120);

      return () => clearTimeout(timeout);

    }
  }, [index]);

  return (
    <>
      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <h1 className="typing-container">
            <span className="typing-text">{displayText}</span>
            <span className="cursor">|</span>
          </h1>

          <p>
            Your gateway to world-class education. Learn from industry experts,
            build real-world skills and accelerate your career.
          </p>

          <div className="hero-buttons">
            <button className="btn primary">Student Login</button>
            <button className="btn secondary">Faculty Login</button>
          </div>

        </div>

      </section>


      {/* STATS */}

      <section className="stats">

        <div className="container stats-grid">

          <div className="stat-card">
            <h2>5000+</h2>
            <p>Students Enrolled</p>
          </div>

          <div className="stat-card">
            <h2>200+</h2>
            <p>Expert Faculty</p>
          </div>

          <div className="stat-card">
            <h2>50+</h2>
            <p>Courses</p>
          </div>

          <div className="stat-card">
            <h2>95%</h2>
            <p>Placement Rate</p>
          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="features">

        <h2 className="section-title">Why Choose SKIT</h2>

        <div className="container feature-grid">

          <div className="feature-card">
            <FaChalkboardUser className="icon"/>
            <h3>Expert Faculty</h3>
            <p>Learn from experienced industry professionals.</p>
          </div>

          <div className="feature-card">
            <FaBook className="icon"/>
            <h3>Modern Curriculum</h3>
            <p>Courses updated with latest technologies.</p>
          </div>

          <div className="feature-card">
            <FaBriefcase className="icon"/>
            <h3>Career Support</h3>
            <p>Dedicated placement team helping students.</p>
          </div>

          <div className="feature-card">
            <FaAward className="icon"/>
            <h3>Certifications</h3>
            <p>Globally recognized certifications.</p>
          </div>

          <div className="feature-card">
            <FaUsers className="icon"/>
            <h3>Community</h3>
            <p>Connect with professionals and mentors.</p>
          </div>

          <div className="feature-card">
            <FaGraduationCap className="icon"/>
            <h3>Global Recognition</h3>
            <p>Degrees recognized across the globe.</p>
          </div>

        </div>

      </section>


      {/* COURSES */}

      <section className="courses">

        <h2 className="section-title">Popular Courses</h2>

        <div className="container course-grid">

          <div className="course-card">
            <h3>Computer Science</h3>
            <p>12 Subjects</p>
            <button>Explore</button>
          </div>

          <div className="course-card">
            <h3>Business Administration</h3>
            <p>10 Subjects</p>
            <button>Explore</button>
          </div>

          <div className="course-card">
            <h3>Engineering</h3>
            <p>15 Subjects</p>
            <button>Explore</button>
          </div>

          <div className="course-card">
            <h3>Arts & Science</h3>
            <p>20 Subjects</p>
            <button>Explore</button>
          </div>

          <div className="course-card">
            <h3>Commerce</h3>
            <p>8 Subjects</p>
            <button>Explore</button>
          </div>

          <div className="course-card">
            <h3>Management</h3>
            <p>9 Subjects</p>
            <button>Explore</button>
          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="cta">

        <h2>Ready to Transform Your Future?</h2>

        <p>Start learning today and build your career.</p>

        <div className="hero-buttons">
          <button className="btn primary">Register</button>
          <button className="btn secondary">Contact</button>
        </div>

      </section>


      {/* FOOTER */}

      <footer className="footer">

        <div className="container footer-grid">

          <div>
            <h3>24/7</h3>
            <p>Online Learning</p>
          </div>

          <div>
            <h3>100%</h3>
            <p>Flexible Schedule</p>
          </div>

          <div>
            <h3>∞</h3>
            <p>Lifetime Access</p>
          </div>

        </div>

      </footer>

    </>
  );
};

export default Home;