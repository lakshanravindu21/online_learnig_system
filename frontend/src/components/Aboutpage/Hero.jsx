import React from "react";
import laptopImg from "../../assets/laptopImg.jpg";





const Hero = () => {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#d6f1f6] to-[#f6d6f3] font-sans">
        {/* Breadcrumb */}
        <p className="px-10 pt-10 text-sm text-gray-600 mb-2">Home / About Us</p>

        {/* Heading */}
        <h1 className="px-10 text-4xl font-bold text-gray-900 leading-snug mb-8">
          Providing Unrivaled <br /> Quality in Online Courses
        </h1>

        {/* Content */}
        <div className="relative inline-block w-full">
          <img
            src={laptopImg}
            alt="Laptop with coffee"
            className="w-full min-w-[1520px] h-[482px] rounded-lg object-cover"
          />

          {/* Experience Card */}
          <div className="absolute bottom-5 right-5 bg-white p-6 rounded-xl shadow-lg w-72">
            <h2 className="text-4xl font-bold text-gray-900">10+</h2>
            <p className="text-lg font-semibold text-gray-700 mt-1">
              Years of Experience
            </p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Leveraging 10+ years in the field, our online courses offer
              expertly developed content, designed to support learners with
              engaging and impactful education.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;