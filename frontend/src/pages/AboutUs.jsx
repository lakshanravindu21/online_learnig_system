import React from "react";


import Hero from "../components/Aboutpage/Hero";
import Showcase from "../components/Aboutpage/Showcase";
import Journey from "../components/Aboutpage/Journey";
import Learning from "../components/Aboutpage/Learning";
import LearningExperienceSection from "../components/Aboutpage/LearningExperienceSection";  


const AboutUs = () => {
  return (
    <div>
      <Hero />
      <Journey/>
      <Showcase />
      <Learning />
      <LearningExperienceSection />

      </div>
  );
};

export default AboutUs;
