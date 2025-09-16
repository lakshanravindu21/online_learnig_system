import React from "react";
import { ArrowUpRight } from "lucide-react";
import matthewRyanImg from "../assets/matthew-ryan.png";
import danieljosephImg from "../assets/daniel-joseph.png";
import jamesmichaelImg from "../assets/james-michael.png";
import adambennettImg from "../assets/adam-bennett.png";
const mentors = [
  {
    name: "Matthew Ryan",
    role: "Product Designer",
    img: matthewRyanImg,
    bg: "bg-pink-200",
  },
  {
    name: "Daniel Joseph",
    role: "Software Engineer",
    img: danieljosephImg,
    bg: "bg-pink-100",
  },
  {
    name: "Adam Bennett",
    role: "Digital Marketer",
    img: adambennettImg,
    bg: "bg-yellow-100",
  },
  {
    name: "James Michael",
    role: "Digital Marketer",
    img: jamesmichaelImg,
    bg: "bg-orange-100",
  },
];

export default function TeamSection() {
  return (
  <section className="w-full min-h-screen bg-[#011813] flex flex-col items-center justify-center py-8 md:py-12 lg:py-16">
      {/* Title and Button */}
      <div className="flex flex-col md:flex-row w-full max-w-[95vw] xl:max-w-6xl justify-between items-start md:items-center mb-8 md:mb-12 px-2 sm:px-4 md:px-6 lg:px-8 gap-4 md:gap-0">
        <h2 className="text-white font-outfit font-semibold text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight">
          Learn from the Best Talent
          <br />
          in the Industry
        </h2>
        <button
          type="button"
          className="flex items-center bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 text-[#011813] font-outfit font-medium text-base shadow hover:scale-105 transition"
        >
          View All Mentors
          <span className="ml-3 flex items-center justify-center w-11 h-11 bg-[#011813] rounded-full">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </span>
        </button>
      </div>
      {/* Mentor Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-[95vw] xl:max-w-6xl justify-center px-2 sm:px-4 md:px-6 lg:px-8">
        {mentors.map((mentor) => (
          <div
            key={mentor.name}
            className={`flex flex-col items-center justify-start ${mentor.bg} rounded-[1000px] w-full max-w-xs h-[400px] sm:h-[420px] md:h-[460px] lg:h-[500px] pt-10 sm:pt-12 md:pt-14 shadow-lg mx-auto`}
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden mb-4 sm:mb-6 flex items-center justify-center">
              <img
                src={mentor.img}
                alt={mentor.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center mt-2">
              <h5 className="font-outfit font-semibold text-lg sm:text-xl text-[#011813] mb-1">
                {mentor.name}
              </h5>
              <p className="font-outfit font-normal text-base text-[#4E5255]">
                {mentor.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
