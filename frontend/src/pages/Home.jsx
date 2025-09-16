import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LearningExperienceSection from "../components/Aboutpage/LearningExperienceSection"; 
import FAQ from './FAQ';

const Home = () => {
  return (
    <>
      <Header />
      <main>
        {/* Add your home page content here */}
        <LearningExperienceSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default Home;