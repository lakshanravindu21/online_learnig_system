import React from 'react'
import laptopImg from '../assets/laptopImg.jpg'
import teamImg from '../assets/team.png'
import studentsImg from '../assets/student.jpg'
import a from '../assets/a.jpg'
import b from '../assets/b.jpg'
import c from '../assets/c.png'

import './AboutUs.css'

const AboutUs = () => {
  return (
    <div>
        <section className="about-section">
             
               <p className="breadcrumb">Home / About Us</p>
           
      <h1 className="about-heading">
        Providing Unrivaled <br /> Quality in Online Courses
      </h1>

      <div className="about-content">
        <img src={laptopImg} alt="Laptop with coffee" className="about-image" />

        <div className="experience-card">
          <h2 className="experience-number">10+</h2>
          <p className="experience-title">Years of Experience</p>
          <p className="experience-desc">
            Leveraging 10+ years in the field, our online courses offer expertly
            developed content, designed to support learners with engaging and
            impactful education.
          </p>
        </div>
      </div>

        </section>  


         <section className="choose-section">
      <div className="choose-left">
        <h2 className="choose-heading">Why Choose Us for Your Learning Journey</h2>
        <p className="choose-subtext">
          Our team combines innovation, expertise, and a client-centered
          approach, delivering projects with outstanding quality, meticulous
          attention to detail, and a focus on meaningful growth.
        </p>

        <div className="choose-feature">
          <span className="icon green">
            <i className="fas fa-chalkboard-teacher"></i> {/* Example: Font Awesome icon */}
          </span>
          <div>
            <h3>Expert-led courses</h3>
            <p>
              Learn from experienced professionals in fields like marketing,
              design, development, finance, and more.
            </p>
          </div>
        </div>

        <div className="choose-feature">
          <span className="icon pink">
            <i className="fas fa-user-graduate"></i> {/* Example: Font Awesome icon */}
          </span>
          <div>
            <h3>Personalized learning paths</h3>
            <p>
              Tailor your journey with courses that align with your unique goals
              and pace.
            </p>
          </div>
        </div>

        <div className="choose-feature">
          <span className="icon purple">
            <i className="fas fa-laptop-code"></i> {/* Example: Font Awesome icon */}
          </span>
          <div>
            <h3>Interactive learning</h3>
            <p>
              Engage with multimedia content, quizzes, and assignments designed
              to make learning dynamic and enjoyable.
            </p>
          </div>
        </div>
      </div>


      <div className="choose-right">
      <div className="image-stack-container">
        {/* Top image */}
        <img src={teamImg} alt="Teacher presenting in a classroom" className="stacked-image top-image" />

        {/* Bottom image */}
        <img src={studentsImg} alt="Student working on laptop" className="stacked-image bottom-image" />

        {/* Students card overlay */}
        <div className="students-card">
          <p>
            <strong>100K Students</strong>
          </p>
          <img src={a} alt="Students avatars" className="students-img" />
         <img src={b} alt="Students avatars" className="students-img" />
          <img src={c} alt="Students avatars" className="students-img" />
        </div>
      </div>
    </div>
    </section>
    </div>
  )
}

export default AboutUs
