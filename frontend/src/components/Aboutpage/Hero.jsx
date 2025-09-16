import React from "react";
import laptopImg from "../../assets/laptopImg.jpg";





const Hero = () => {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#d6f1f6] to-[#f6d6f3] font-sans">
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto py-5 text-gray-600 flex items-center gap-1 text-base md:text-lg">
          <a href="/" className="hover:text-gray-800 transition-colors">Home</a>
          <span className="mx-2 align-middle">/</span>
          <span className="font-medium text-gray-800">About Us</span>
        </div>

        {/* Heading */}
      <h1 className="px-4 md:px-10 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-6 md:mb-8">
        Providing Unrivaled <br className="hidden sm:block" /> Quality in Online Courses
      </h1>

      {/* Content */}
      <div className="relative w-full">
        <img
          src={laptopImg}
          alt="Laptop with coffee"
          className="w-full h-48 sm:h-72 md:h-[482px] rounded-lg object-cover"
        />

        {/* Experience Card */}
        <div className="absolute bottom-4 right-4 bg-white p-4 sm:p-6 rounded-xl shadow-lg w-60 sm:w-72 max-w-[90%]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">10+</h2>
          <p className="text-base sm:text-lg font-semibold text-gray-700 mt-1">
            Years of Experience
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Leveraging 10+ years in the field, our online courses offer expertly
            developed content, designed to support learners with engaging and
            impactful education.
          </p>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Hero;