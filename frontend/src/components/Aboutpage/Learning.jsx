import React from "react";
import { ArrowRight } from "lucide-react";
import Girl from "../../assets/girl.png";
import Boy from "../../assets/boy.png";

const Learning = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-10 p-8 bg-gray-50 min-h-[50vh] items-center justify-center">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-12  max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-300 rounded-full opacity-20 transform -translate-x-10 translate-y-10"></div>

          <div className="flex flex-col md:flex-row items-center gap-6">
  {/* Left side: text */}
  <div className="flex-1">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 whitespace-nowrap">
      Become an Instructor?
    </h2>
    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
      Become an Instructor. Join us to share your expertise, inspire learners, and shape the future of education together.
    </p>
    <button className="bg-gray-800 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-700 transition-colors duration-200 text-sm font-medium">
      Join with Us
      <ArrowRight size={16} />
    </button>
  </div>

  {/* Right side: image */}
  <div className="flex-1 flex items-center justify-center">
    <div className="w-36 h-36 relative overflow-hidden rounded-xl">
      <img
        src={Boy}
        alt="Boy"
        className="w-full h-full object-cover"
      />
    

              </div>
            </div>
          </div>
        </div>

        {/* Get Online Courses Card */}
        <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl p-12  max-w-lg w-full relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-300 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-green-300 rounded-full opacity-20 transform -translate-x-10 translate-y-10"></div>
          <div></div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Left side: text */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 whitespace-nowrap">
                Get Online Courses
              </h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Join as a student to access online courses, gain in-demand
                skills, and build a strong foundation for future success.
              </p>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium">
                Start Learning
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Right side: image */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-36 h-36 relative overflow-hidden rounded-xl">
                <img
                  src={Girl}
                  alt="Girl"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
