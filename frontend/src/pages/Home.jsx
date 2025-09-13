import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FAQ from './FAQ';

const Home = () => {
  return (
    <>
      <Header />
      <main>
        {/* Add your home page content here */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default Home;