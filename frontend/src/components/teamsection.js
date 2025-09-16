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
    <section className="w-full min-h-screen bg-[#011813] flex flex-col items-center justify-center py-16">
      {/* Title and Button */}
      <div className="flex w-full max-w-6xl justify-between items-center mb-12 px-4">
        <h2 className="text-white font-outfit font-semibold text-4xl md:text-5xl leading-tight">
          Learn from the Best Talent
          <br />
          in the Industry
        </h2>
        <a
          href="#"
          className="flex items-center bg-white rounded-full px-6 py-3 text-[#011813] font-outfit font-medium text-base shadow hover:scale-105 transition"
        >
          View All Mentors
          <span className="ml-3 flex items-center justify-center w-11 h-11 bg-[#011813] rounded-full">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </span>
        </a>
      </div>
      {/* Mentor Cards */}
      <div className="flex flex-row gap-8 w-full max-w-6xl justify-center">
        {mentors.map((mentor) => (
          <div
            key={mentor.name}
            className={`flex flex-col items-center justify-start ${mentor.bg} rounded-[1000px] w-72 h-[500px] pt-16 shadow-lg`}
          >
            <div className="w-40 h-40 rounded-full overflow-hidden mb-6 flex items-center justify-center">
              <img
                src={mentor.img}
                alt={mentor.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center mt-2">
              <h5 className="font-outfit font-semibold text-xl text-[#011813] mb-1">
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
