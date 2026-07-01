import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
// import { dummyResumeData } from "../resume_assets/assets";
import { ArrowLeftIcon, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, Share2Icon } from "lucide-react";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderIcon,
  Sparkles,
} from "lucide-react";
import PersonalInfoForm from "../resume_components/PersonalInfoForm";
import ResumePreview from "../resume_components/ResumePreview";
import TemplateSelector from "../resume_components/TemplateSelector";
import ColorPicker from "../resume_components/ColerPicker";
import ProfessionalSummaryForm from "../resume_components/ProfessionalSummaryForm";
import ExperienceForm from "../resume_components/ExperienceForm";
import EducationForm from "../resume_components/EducationForm";
import ProjectForm from "../resume_components/ProjectForm";
import SkillForm from "../resume_components/SkillForm";
import { useSelector } from "react-redux";
import api from "../resume_config/api";
import toast from "react-hot-toast";

export const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const {token} = useSelector(state=> state.auth)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackGound, setRemoveBackGround] = useState(0);
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3882F6",
    public: false,
  });

const loadExistingResume = async () => {
  try {
    const { data } = await api.get('/api/resumes/get/' + resumeId, {headers: {Authorization: `Bearer ${token}` } })
    if(data.resume) {
      // Merge with default state to ensure all fields are present
      // setResumeData(prev => ({
      //   ...prev,
      //   ...data.resume,
      //   personal_info: data.resume.personal_info || prev.personal_info,
      //   professional_summary: data.resume.professional_summary || prev.professional_summary,
      //   experience: data.resume.experience || prev.experience,
      //   education: data.resume.education || prev.education,
      //   project: data.resume.project || prev.project,
      //   skills: data.resume.skills || prev.skills,
      //   template: data.resume.template || prev.template,
      //   accent_color: data.resume.accent_color || prev.accent_color,
      //   public: data.resume.public !== undefined ? data.resume.public : prev.public,
      // }))
      setResumeData(data.resume)
      document.title = data.resume.title || 'Resume Builder';
    }
  } catch (error) {
    console.error('Error loading resume:', error.message)
  }
}
  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];
  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    if (resumeId && token) {
      loadExistingResume();
    }
  }, [resumeId, token]);

const changeResumeVisibility = async () => {
  try {
    const formData = new FormData()
    formData.append("resumeId", resumeId)
    formData.append("resumeData", JSON.stringify({ public: !resumeData.public }))

    const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: `Bearer ${token}` } })

    setResumeData(prev => ({ ...prev, public: !prev.public }))
    toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume:", error)
    toast.error('Failed to update visibility')
  }
}

const handleShare = () => {
  const frontendUrl = window.location.href.split('/app/')[0];
  const resumeUrl = frontendUrl + '/view/' + resumeId;

  if(navigator.share){
    navigator.share({url: resumeUrl, text: "My Resume", })
  }else{
    alert('Share not supported on this browser.')
  }
}

const downloadResume = ()=>{
  window.print();
}

const saveResume = async () => {
  try {
    let updatedResumeData = structuredClone(resumeData)

    // remove image from updatedResumeData
    if(typeof updatedResumeData.personal_info.image === 'object'){
      delete updatedResumeData.personal_info.image
    }

    const formData = new FormData();
    formData.append("resumeId", resumeId)
    formData.append('resumeData', JSON.stringify(updatedResumeData))
    removeBackGound && formData.append("removeBackground", "yes");
    typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)

    const { data } = await  api.put('/api/resumes/update',formData,{headers: {Authorization: `Bearer ${token}` } })
    setResumeData(data.resume)
    toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume", error)

  }
}

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 
        hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to DashBoard
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/*      left panel      */}
          <div className="relative lg:col-span-5 rounded-1g overflow-hidden">
            <div className="bg-white rounded-1g shadow-sm border border-gray-200 p-6 pt-1">
              {/* progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-orange-700 to-blue-700 border-none transition-all duration-1000"
                style={{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }%`,
                }}
              />
              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange=
                    {(template)=> setResumeData(prev => ({...prev, template}))}/>
                    <ColorPicker selectedColor={resumeData.accent_color } onChange={(color)=>setResumeData(prev=>({...prev,accent_color:color}))} />
                </div>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0)
                        )
                      }
                      className=" flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50
                   transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1)
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1
                        ? "opacity-50"
                        : ""
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              {/* form content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackGound}
                    setRemoveBackground={setRemoveBackGround}
                  />
                )}

                {
                  activeSection.id === "summary" &&(
                    <ProfessionalSummaryForm data={resumeData.professional_summary}
                    onChange={(data)=>setResumeData(prev=>({...prev,
                      professional_summary:data
                    }))} setResumeData={setResumeData}/>
                  )
                }
                 {
                  activeSection.id === "experience" &&(
                    <ExperienceForm data={resumeData.experience}
                    onChange={(data)=>setResumeData(prev=>({...prev,
                      experience:data
                    }))}/>
                  )
                }
                 {
                  activeSection.id === "education" &&(
                    <EducationForm data={resumeData.education}
                    onChange={(data)=>setResumeData(prev=>({...prev,
                      education:data
                    }))}/>
                  )
                }
                {
                  activeSection.id === "projects" &&(
                    <ProjectForm data={resumeData.project}
                    onChange={(data)=>setResumeData(prev=>({...prev,
                      project:data
                    }))}/>
                  )
                }
                  {
                  activeSection.id === "skills" &&(
                    <SkillForm data={resumeData.skills}
                    onChange={(data)=>setResumeData(prev=>({...prev,
                      skills:data
                    }))}/>
                  )
                }
              </div>
              <button onClick={()=>{toast.promise(saveResume, {loading: 'Saving...'})}} className=" bg-gradient-to-br from-green-100 to-gray-200 ring-gray-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm">
                Svae Changes
              </button>
            </div>
          </div>
          {/* right pannel */}
           
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className='relative w-full'>
                <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                  {resumeData.public && (
                    <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                      <Share2Icon className='size-4' /> Share
                    </button>
                  )}
                  <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                    {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                    {resumeData.public ? 'Public' : 'Private'}
                  </button>
                  <button onClick={downloadResume} className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors ">
                    <DownloadIcon className="size-4"/> Download
                  </button>
                </div>
              </div>
            {/*resume preview  */}
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
          </div>
        </div>
      </div>
    </div>
  );
};



