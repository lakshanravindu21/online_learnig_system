import React from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import experience from "../../assets/experience.jpg";

const LearningExperienceSection = () => {
  return (
    <div className="bg-gray-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Desktop Setup Image */}
          <div className="flex-1 relative">
            <div className="relative">
              {/* Website content mockup */}
              <div className="mt-8 px-4 w-full">
                <img
                  src={experience}
                  alt="Learning Experience"
                  className="w-full h-auto rounded-3xl shadow-lg"
                />
              </div>

              {/* Statistics Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 w-48">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    Average Class
                    <br />
                    Completion Rate
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="text-teal-500" size={16} />
                    <span className="text-xs text-teal-500 font-medium">
                      65%+
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-gray-800">95%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                We Ensure an Exceptional Learning Experience
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We guarantee an exceptional learning experience with expert
                instructors, interactive lessons, and hands-on opportunities
                designed to ensure student success and growth.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  100,000+
                </div>
                <p className="text-gray-600">
                  Students effectively enhanced digital skills using our
                  platform.
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  20,000+
                </div>
                <p className="text-gray-600">
                  Students have built successfully career in various tech
                  companies
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full flex items-center gap-3 transition-colors duration-200 font-medium">
                Explore Courses
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningExperienceSection;
