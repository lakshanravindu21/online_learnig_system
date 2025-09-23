import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Header from "../components/Header";
import TeamSection from "../components/teamsection";
import Footer from "../components/Footer";
import axios from "axios";

export default function CourseSection() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Filter by category
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter((course) => course.category === category));
    }
  };

  return (
    <>
      <Header />
      <section className="relative w-full min-h-screen bg-gradient-to-r from-[#d6f1f6] to-[#f6d6f3] flex flex-col items-center pt-8 md:pt-12 lg:pt-16">
        {/* Container */}
        <div className="relative w-full max-w-[95vw] xl:max-w-[1240px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center mb-4 text-base font-outfit text-[#011813]">
            <span className="font-normal">Home</span>
            <span className="mx-2">/</span>
            <span className="font-normal text-[#009D77]">Courses</span>
          </div>

          {/* Section Title Block */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4 md:gap-0">
            <h1 className="text-black font-outfit font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight max-w-full md:max-w-3xl">
              We Offer an Outstanding
              <br />Learning Experience
            </h1>
            {/* Dot Image */}
            <svg
              width="108"
              height="46"
              className="hidden md:block"
              viewBox="0 0 108 46"
              fill="none"
            >
              {[0, 19, 38, 57, 76, 96].map((x) =>
                [0, 21, 45].map((y) => (
                  <circle
                    key={`${x}-${y}`}
                    cx={x + 6}
                    cy={y + 6}
                    r="4"
                    fill="#8D8E8F"
                  />
                ))
              )}
            </svg>
          </div>

          {/* Featured Course (show first course if exists) */}
          {courses.length > 0 && (
            <div className="relative w-full max-w-full xl:max-w-[1200px] mx-auto bg-white/5 border border-[#E7E7E8] rounded-2xl flex flex-col md:flex-row items-center p-4 sm:p-6 md:p-8 gap-6 md:gap-8 shadow-lg">
              {/* Image Wrapper */}
              <div className="w-full h-56 sm:h-72 md:w-[300px] md:h-[300px] lg:w-[376px] lg:h-[376px] rounded-xl overflow-hidden flex-shrink-0 relative bg-black/10 mb-4 md:mb-0">
                <img
                  src={`http://localhost:5000${courses[0].thumbnail}`}
                  alt={courses[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Card Body */}
              <div className="flex-1 flex flex-col justify-between h-full py-2 min-w-0">
                {/* Badge Block */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#F0F0F0] text-[#011813] font-outfit font-medium px-4 py-2 rounded-lg text-base">
                    {courses[0].category}
                  </span>
                  <span className="flex items-center bg-[#011813] text-white font-outfit font-medium px-4 py-2 rounded-full text-base gap-2">
                    <span className="flex items-center justify-center w-5 h-5">
                      {/* Fire Icon */}
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#FD5133" />
                        <circle cx="10" cy="14" r="5" fill="#FEBA22" />
                      </svg>
                    </span>
                    Popular
                  </span>
                </div>
                {/* Title & Description */}
                <div className="mb-4">
                  <h3 className="text-[#011813] font-outfit font-semibold text-2xl md:text-3xl mb-2">
                    {courses[0].title}
                  </h3>
                  <p className="text-[#4E5255] font-outfit text-base max-w-lg">
                    {courses[0].description}
                  </p>
                </div>
                {/* Divider */}
                <div className="w-full h-px bg-[#E7E7E8] mb-4"></div>
                {/* Price & Button Block */}
                <div className="flex items-center justify-between">
                  <span className="text-[#009D77] font-outfit font-semibold text-2xl md:text-3xl">
                    ${courses[0].price}
                  </span>
                  <a
                    href="#"
                    className="flex items-center bg-transparent border border-[#011813] rounded-full px-6 py-3 text-[#011813] font-outfit font-medium text-base gap-2 hover:bg-[#011813] hover:text-white transition"
                  >
                    View Details
                    <span className="ml-2 flex items-center justify-center w-10 h-10 bg-[#011813] rounded-full">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Course Cards Grid Section */}
        <div className="w-full flex flex-col items-center mt-8 md:mt-12 lg:mt-16">
          <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#011813] text-center mb-8">
            Explore Our All Courses
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center mb-6 md:mb-10">
            {["All", "Development", "UI/UX Design", "Project Management", "Accounting", "Marketing"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex items-center px-6 py-3 rounded-full border font-outfit font-medium text-base transition-all ${
                    activeCategory === cat
                      ? "bg-[#009D77] text-white border-[#009D77]"
                      : "bg-white text-[#4E5255] border-[#E7E7E8]"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-full xl:max-w-[1200px] mx-auto mb-8 md:mb-12">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-col"
              >
                <img
                  src={`http://localhost:5000${course.thumbnail}`}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center justify-between mb-2">
                  <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">
                    {course.category}
                  </span>
                  <span className="font-outfit font-semibold text-xl text-[#009D77]">
                    ${course.price}
                  </span>
                </div>
                <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">
                  {course.title}
                </h3>
                <p className="text-[#4E5255] text-sm font-outfit line-clamp-2 mb-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
                  <span>Duration: Coming Soon</span>
                  <span>Lectures: Coming Soon</span>
                </div>
              </div>
            ))}
          </div>

          {/* View More Courses Button */}
          <div className="flex justify-center mt-8 mb-16">
            <button className="flex items-center border border-[#011813] rounded-full px-8 py-4 text-[#011813] font-outfit font-medium text-lg hover:bg-[#011813] hover:text-white transition-all duration-300">
              View More Courses
            </button>
          </div>
        </div>

        <TeamSection />
        <Footer />
      </section>
    </>
  );
}
