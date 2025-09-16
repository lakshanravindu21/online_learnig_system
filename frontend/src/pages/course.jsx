import React from "react";
import { ArrowUpRight } from "lucide-react";
import Header from "../components/Header";
import htmlCssJsImg from "../assets/HTML CSS JS Course.png";
import stakeholdermanagement from "../assets/stakeholder-management.png";
import googleAdsImg from "../assets/google-ads-course.png";
import uxResearchImg from "../assets/ux-research-course.png";
import financialAccountingImg from "../assets/accounting-course.png";
import designSystemsImg from "../assets/design-systems-course.png";
import digitalMarketingImg from "../assets/digital-marketing-course.png";
import htmlcssbeyondcourse from "../assets/html-css-beyond-course.png";
import uiuxessentialscourse from "../assets/uiux-essentials-course.png";
export default function CourseSection() {
  return (
    <>
      <Header />
      <section className="relative w-full min-h-screen bg-[#F5F7FA] flex flex-col items-center py-16">
      {/* Container */}
      <div className="relative w-full max-w-[1240px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center mb-4 text-base font-outfit text-[#011813]">
          <span className="font-normal">Home</span>
          <span className="mx-2">/</span>
          <span className="font-normal text-[#009D77]">Courses</span>
        </div>
        {/* Section Title Block */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-black font-outfit font-bold text-5xl md:text-7xl leading-tight max-w-3xl">
            We Offer an Outstanding<br />Learning Experience
          </h1>
          {/* Dot Image */}
          <svg width="108" height="46" className="hidden md:block" viewBox="0 0 108 46" fill="none">
            {[0, 19, 38, 57, 76, 96].map((x) =>
              [0, 21, 45].map((y) => (
                <circle key={`${x}-${y}`} cx={x + 6} cy={y + 6} r="4" fill="#8D8E8F" />
              ))
            )}
          </svg>
        </div>
        {/* Course Card */}
        <div className="relative w-full max-w-[1200px] mx-auto bg-white/5 border border-[#E7E7E8] rounded-2xl flex flex-row items-center p-8 gap-8 shadow-lg">
          {/* Image Wrapper */}
          <div className="w-[376px] h-[376px] rounded-xl overflow-hidden flex-shrink-0 relative bg-black/10">
           <img src={htmlCssJsImg} alt="HTML CSS JS Course" className="w-full h-full object-cover" />
            
          </div>
          {/* Card Body */}
          <div className="flex-1 flex flex-col justify-between h-full py-2">
            {/* Badge Block */}
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#F0F0F0] text-[#011813] font-outfit font-medium px-4 py-2 rounded-lg text-base">
                Development
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
                HTML, CSS, and JavaScript
              </h3>
              <p className="text-[#4E5255] font-outfit text-base max-w-lg">
                Gain UI design mastery with hands-on expert mentorship, refining your skills through personalized guidance and feedback.
              </p>
            </div>
            {/* Info Block */}
            <div className="flex items-center gap-8 mb-4">
              <div className="flex items-center gap-2 text-[#4E5255] font-outfit text-base">
                {/* Clock Icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="9" stroke="#4E5255" strokeWidth="1.5" />
                  <path d="M10 5v5l3 3" stroke="#4E5255" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                4hr 35min
              </div>
              <div className="flex items-center gap-2 text-[#4E5255] font-outfit text-base">
                {/* Lectures Icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <rect x="3" y="5" width="14" height="10" rx="2" stroke="#4E5255" strokeWidth="1.5" />
                  <rect x="7" y="9" width="6" height="2" rx="1" fill="#4E5255" />
                </svg>
                30 lectures
              </div>
            </div>
            {/* Divider */}
            <div className="w-full h-px bg-[#E7E7E8] mb-4"></div>
            {/* Price & Button Block */}
            <div className="flex items-center justify-between">
              <span className="text-[#009D77] font-outfit font-semibold text-2xl md:text-3xl">
                $190.00
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
      </div>
      {/* Course Cards Grid Section */}
      <div className="w-full flex flex-col items-center mt-16">
        <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#011813] text-center mb-8">
          Explore Our All Courses
        </h2>
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button className="flex items-center bg-[#009D77] text-white font-outfit font-medium px-6 py-3 rounded-full border border-[#009D77]">
            All Categories
          </button>
          <button className="flex items-center bg-white text-[#4E5255] font-outfit font-medium px-6 py-3 rounded-full border border-[#E7E7E8]">
            Development
          </button>
          <button className="flex items-center bg-white text-[#4E5255] font-outfit font-medium px-6 py-3 rounded-full border border-[#E7E7E8]">
            UI/UX Design
          </button>
          <button className="flex items-center bg-white text-[#4E5255] font-outfit font-medium px-6 py-3 rounded-full border border-[#E7E7E8]">
            Project Management
          </button>
          <button className="flex items-center bg-white text-[#4E5255] font-outfit font-medium px-6 py-3 rounded-full border border-[#E7E7E8]">
            Accounting
          </button>
          <button className="flex items-center bg-white text-[#4E5255] font-outfit font-medium px-6 py-3 rounded-full border border-[#E7E7E8]">
            Marketing
          </button>
        </div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto mb-12">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
           <img src={htmlCssJsImg} alt="HTML CSS JS Course" className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">Project Management</span>
              <span className="font-outfit font-semibold text-xl text-[#009D77]">$190.00</span>
            </div>
            <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">HTML, CSS, and JavaScript</h3>
            <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
              <span>4hr 35min</span>
              <span>30 lectures</span>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
            <img src={stakeholdermanagement} alt="HTML CSS JS Course"  className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">Development</span>
              <span className="font-outfit font-semibold text-xl text-[#009D77]">$160.00</span>
            </div>
            <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">Stakeholders Management</h3>
            <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
              <span>2hr 35min</span>
              <span>20 lectures</span>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
           <img src={googleAdsImg} alt="Google Ads & PPC Campaigns" className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">Marketing</span>
              <span className="font-outfit font-semibold text-xl text-[#009D77]">$140.00</span>
            </div>
            <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">Google Ads & PPC Campaigns</h3>
            <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
              <span>3hr 35min</span>
              <span>25 lectures</span>
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
            <img src={uxResearchImg} alt="UX Research & Usability Testing" className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">UI/UX Design</span>
              <span className="font-outfit font-semibold text-xl text-[#009D77]">$180.00</span>
            </div>
            <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">UX Research & Usability Testing</h3>
            <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
              <span>3hr 35min</span>
              <span>25 lectures</span>
            </div>
          </div>
          {/* Card 5 */}
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
           <img src={financialAccountingImg} alt="Financial Accounting Essentials" className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">Accounting</span>
              <span className="font-outfit font-semibold text-xl text-[#009D77]">$140.00</span>
            </div>
            <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">Financial Accounting Essentials</h3>
            <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
              <span>2hr 35min</span>
              <span>20 lectures</span>
            </div>
          </div>
          {/* Card 6 */}
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
            <img src={designSystemsImg } alt="Introduction to Design Systems" className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">UI/UX Design</span>
              <span className="font-outfit font-semibold text-xl text-[#009D77]">$150.00</span>
            </div>
            <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">Introduction to Design Systems</h3>
            <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
              <span>3hr 35min</span>
              <span>25 lectures</span>
            </div>
          </div>
          {/* Card 7 */}
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
            <img src={digitalMarketingImg} alt="Digital Marketing Strategy" className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">Marketing</span>
              <span className="font-outfit font-semibold text-xl text-[#009D77]">$140.00</span>
            </div>
            <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">Digital Marketing Strategy</h3>
            <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
              <span>2hr 35min</span>
              <span>20 lectures</span>
            </div>
          </div>
          {/* Card 8 */}
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
           <img src={ htmlcssbeyondcourse }  alt="HTML, CSS, and Beyond" className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">Development</span>
              <span className="font-outfit font-semibold text-xl text-[#009D77]">$180.00</span>
            </div>
            <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">HTML, CSS, and Beyond</h3>
            <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
              <span>4hr 35min</span>
              <span>30 lectures</span>
            </div>
          </div>
          {/* Card 9 */}
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col">
            <img src={uiuxessentialscourse} alt="UI/UX Essentials for Engaging" className="w-full h-48 object-cover rounded-lg mb-4" />
            <div className="flex items-center justify-between mb-2">
              <span className="px-4 py-2 rounded-lg text-base font-outfit font-medium bg-[#F0F0F0] text-[#011813]">UI/UX Design</span>
              <span className="font-outfit font-semibold text-xl text-[#009D77]">$160.00</span>
            </div>
            <h3 className="font-outfit font-medium text-lg text-[#011813] mb-2">UI/UX Essentials for Engaging</h3>
            <div className="flex items-center gap-6 text-[#4E5255] text-sm font-outfit">
              <span>3hr 35min</span>
              <span>25 lectures</span>
            </div>
          </div>
        </div>
        {/* View More Courses Button */}
        <div className="flex justify-center mt-8 mb-16">
          <button className="flex items-center border border-[#011813] rounded-full px-8 py-4 text-[#011813] font-outfit font-medium text-lg hover:bg-[#011813] hover:text-white transition-all duration-300">
            View More Courses
          </button>
        </div>
      </div>
    </section>
    </>
  );
}