import { Zap, FileText, Palette, Download } from "lucide-react";
import React from "react";
import Title from "./Title";

const Feature = () => {
  const [activeCard, setActiveCard] = React.useState(0);

  const features = [
    {
      icon: <FileText className="size-6 stroke-violet-600" />,
      title: "AI Resume Builder",
      description:
        "Create professional resumes instantly with AI-powered suggestions and smart formatting.",
      color: "violet",
    },
    {
      icon: <Palette className="size-6 stroke-green-600" />,
      title: "Modern Templates",
      description:
        "Choose from ATS-friendly and modern resume templates designed for recruiters.",
      color: "green",
    },
    {
      icon: <Download className="size-6 stroke-orange-600" />,
      title: "One-Click Download",
      description:
        "Download your resume in PDF format instantly and apply for jobs easily.",
      color: "orange",
    },
  ];

  return (
    <div
      id="features"
      className="flex flex-col items-center my-16 scroll-mt-12"
    >
      {/* Top Badge */}
      <div className="flex items-center gap-3 text-sm text-green-700 bg-green-100 rounded-full px-6 py-2">
        <Zap className="size-4" />
        <span>Smart Resume Features</span>
      </div>

      {/* Title */}
      <Title
        title="Build Your Professional Resume"
        description="Create ATS-friendly resumes in minutes with modern templates, AI-powered tools, and instant PDF downloads."
      />

      {/* Main Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 xl:-mt-6">
        
        {/* Image */}
        <img
          className="max-w-2xl w-full"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
          alt="resume features"
        />

        {/* Feature Cards */}
        <div className="space-y-5 px-4 md:px-0">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveCard(index)}
              className="flex items-center justify-center max-w-md group cursor-pointer"
            >
              <div
                className={`p-6 border rounded-2xl flex gap-4 transition-all duration-300
                ${
                  activeCard === index
                    ? `bg-${feature.color}-100 border-${feature.color}-300`
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                {feature.icon}

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-600 max-w-xs">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Feature;