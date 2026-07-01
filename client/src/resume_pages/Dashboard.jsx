
import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { toast } from 'react-hot-toast';

import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../resume_assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../resume_config/api";
import pdfToText from 'react-pdftotext'


export const Dashboard = () => {
  const {user, token} = useSelector(state => state.auth)
  const [allResumes, setAllResumes] = useState([]);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setshowUploadResume] = useState(false);
  const [editResumeId, setEditResumeId] = useState("");
  const navigate = useNavigate();
  const[isLoading, setIsLoading] =useState(false)

  // Load dummy data
  const loadAllResumes = async () => {
    if (!token) return;
    try{
      const { data } = await api.get('/api/users/resume', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAllResumes(data.resumes || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };

  // Create Resume Handler
const createResume = async (event) => {
  try {
    event.preventDefault()
    const { data } = await api.post('/api/resumes/create', {title}, {headers: {
      Authorization: `Bearer ${token}` }})
    setTitle('')
    setShowCreateResume(false)
    await loadAllResumes() // Refresh the resume list
    navigate(`/app/builder/${data.resume._id}`)
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
  }
}

  const uploadResume = async (event) => {
    event.preventDefault();
    if (!resume) {
      toast.error('Please select a resume file');
      return;
    }
    if (!title) {
      toast.error('Please enter a resume title');
      return;
    }
    setIsLoading(true)
    try{
      // Validate that resume is a File object
      if (!resume || !(resume instanceof File)) {
        toast.error('Invalid file. Please select a valid PDF file.');
        setIsLoading(false)
        return;
      }
      
      // Check file type
      if (resume.type !== 'application/pdf') {
        toast.error('Please upload a PDF file.');
        setIsLoading(false)
        return;
      }
      
      // Pass the File object directly to pdfToText
      // react-pdftotext accepts File objects directly
      const resumeText = await pdfToText(resume)
      
      if (!resumeText || resumeText.trim() === '') {
        toast.error('Failed to extract text from resume. Please try another file.');
        setIsLoading(false)
        return;
      }
      
      // Log for debugging
      console.log('Resume text extracted, length:', resumeText.length)
      console.log('Title:', title)
      console.log('Token exists:', !!token)
      
      const {data} = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers:
        {Authorization: `Bearer ${token}`}
      })
      setTitle('')
      setResume(null)
      setshowUploadResume(false)
      await loadAllResumes() // Refresh the resume list
      navigate(`/app/builder/${data.resumeId}`)
    }catch(error){
      console.error('Upload resume error:', error)
      console.error('Error response:', error?.response?.data)
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to upload resume'
      toast.error(errorMessage)
    }
    setIsLoading(false)
    
  };
 const editTitle = async (event) => {
  try {
    event.preventDefault()
    const { data } = await api.put('/api/resumes/update', { resumeId: editResumeId,
      resumeData: { title } }, { headers: { Authorization: token }})
    setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume,
      title } : resume))
    setTitle('')
    setEditResumeId('')
    toast.success(data.message)
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
  }
}
    const deleteResume = async (resumeId)=>{
    try{
       const confirm = window.confirm('Are you sure you want to delete this resume?')
     if(confirm){
      const {data}= await api.delete(`/api/resumes/delete/${resumeId}`,  {headers:
        {Authorization: `Bearer ${token}`}})
        setAllResumes(prev => prev.filter(resume => resume._id !== resumeId))
        toast.success(data.message || 'Resume deleted successfully')
      
     }
    }catch(error){
      toast.error(error?.response?.data?.message || error.message)
    }

  }
  useEffect(() => {
    loadAllResumes();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f8fbfd]">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-2xl font-medium bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent mb-10">
          Welcome, {user?.name} 👋
        </p>

        {/* === CREATE & UPLOAD BUTTONS === */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* Create Resume */}
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-48 h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="w-10 h-10 bg-indigo-500 text-white p-2 rounded-full group-hover:scale-110 transition-all" />
            <p className="text-sm font-medium group-hover:text-indigo-500">
              Create Resume
            </p>
          </button>

          {/* Upload Existing */}
          <button
            onClick={() => setshowUploadResume(true)}
            className="w-48 h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="bg-purple-500 text-white p-4 rounded-full mb-2">
              <UploadCloudIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Upload Existing Resume
            </p>
          </button>

          {/* ATS Checker */}
          <button
            onClick={() => navigate('/app/ats-checker')}
            className="w-48 h-48 bg-white flex flex-col items-center justify-center rounded-lg gap-2 border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
              ATS
            </div>
            <p className="text-sm font-medium text-gray-700 text-center px-3">
              Run ATS Checker
            </p>
            <p className="text-xs text-slate-500 text-center px-4">
              Analyze resume vs job description and download reports
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[403px] mx-auto" />

        {/* === RESUME GRID === */}
        {allResumes.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
                key={resume._id || index} 
                onClick={()=> navigate(`/app/builder/${resume._id}`)}
                className="relative w-36 h-48 flex flex-col items-center 
                justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}15, ${baseColor}30)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center">
                  Updated on {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                </p>
                <div onClick={e=>e.stopPropagation()} className="absolute top-1 right-1 group-hover:flex items-center hidden gap-1">
                  <TrashIcon onClick={(e)=>{e.stopPropagation(); deleteResume(resume._id)}} className="size-5 p-1 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer" />
                  <PencilIcon onClick={(e)=>{e.stopPropagation(); setEditResumeId(resume._id); setTitle(resume.title) }} className="size-5 p-1 hover:bg-white/50 rounded text-slate-700 transition-colors cursor-pointer" />
                </div>
              </button>
            );
          })}
          </div>
        )}

        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-slate-700">
                Create a Resume
              </h2>

              <input
                type="text"
                placeholder="Enter resume title"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => {
              setshowUploadResume(false);
              setTitle("");
              setResume(null);
            }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-slate-700">
                Upload Resume
              </h2>

              <input
                type="text"
                placeholder="Enter resume title"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div>
                <label
                  htmlFor="resume-id"
                  className="block text-sm text-slate-700 mb-2"
                >
                  Select resume file
                </label>
                <label
                  htmlFor="resume-id"
                  className="flex flex-col items-center justify-center gap-2 border border-dashed border-slate-400 text-slate-400 rounded-md p-4 py-10 my-4 group hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors"
                >
                  {resume ? (
                    <p className="text-green-700">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloudIcon className="size-14 stroke-1" />
                      <p>Upload resume</p>
                    </>
                  )}
                </label>

                <input
                  type="file"
                  id="resume-id"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              <button disabled={isLoading}
                type="submit"
                className="w-full py-2 bg-green-600 flex items-center justify-center gap-2 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {isLoading && <LoaderCircleIcon className="animate-spin size-4 text-white"/>}
                {isLoading? 'Uploading...': "Upload Resume"}
                 
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setshowUploadResume(false);
                  setTitle("");
                  setResume(null);
                }}
              />
            </div>
          </form>
        )}
         {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId('')}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-slate-700">
                Edit Resume Title
              </h2>

              <input
                type="text"
                placeholder="Enter resume title"
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Update
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId('');
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
