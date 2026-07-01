import React, { useState } from "react";
import { motion } from "framer-motion";
import { ServerUrl } from '../App';
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [numberOfQuestions, setNumberOfQuestions] = useState("5");
  const [resumeFile, setResumefile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startError, setStartError] = useState("");
  const [projects, setProject] = useState([]);
  const [skills, setSkill] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const handleUploadResume = async () => {
    console.log("hello")
    if (!resumeFile || analyzing) return;
    setAnalyzing(true)
    const formdata = new FormData();
    formdata.append("resume", resumeFile)
    try {
      const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { headers: { "Content-Type": "multipart/form-data", }, withCredentials: true, });

      console.log(result.data)
      setRole(result.data.role != null ? String(result.data.role) : "");
      setExperience(
        result.data.experience != null ? String(result.data.experience) : ""
      );
      setProject(result.data.projects || []);
      setSkill(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false)
      console.log("skills:", result.data.skills);


    } catch (err) {
      console.log(err)
      setAnalyzing(false)

    }
  }
  const handleStart = async () => {
    setStartError("");
    setLoading(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        {
          role: String(role ?? "").trim(),
          experience: String(experience ?? "").trim(),
          mode: String(mode ?? "").trim(),
          numberOfQuestions: Number(numberOfQuestions),
          resumeText,
          projects,
          skills,
        },
        { withCredentials: true }
      );

      if (userData) {
        dispatch(
          setUserData({ ...userData, credit: result.data.creditsLeft })
        );
      }
      console.log(result.data);

      onStart(result.data);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Could not start the interview.";
      console.error("that erroo", error);
      setStartError(msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-gray-100 to-gray-200 px-4"
    >
      <div
        className="w-full max-w-6xl bg-white rounded-2xl 
        shadow-2xl grid md:grid-cols-2 overflow-hidden"
      >
        {/* LEFT SECTION */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-10 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Start your AI Interview
          </h2>
          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powered by AI.
            Improve communication, technical skills, and confidence.
          </p>


          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <FaUserTie className="text-green-500 text-xl" />
              <p>Choose Role & Experience</p>
            </div>


            <div className="flex items-center gap-4">
              <FaMicrophoneAlt className="text-green-500 text-xl" />
              <p>Smart Voice Interviewt</p>
            </div>

            <div className="flex items-center gap-4">
              <FaChartLine className="text-green-500 text-xl" />
              <p>Performance Analytics</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SECTION */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-green-50 
          to-green-100 p-12 flex flex-col gap-5 justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your AI Interview
          </h2>
          <div className="relative">
            <FaUserTie className="absolute top-2 left-4  text-green-400 text-xl " />
            <input type="text" placeholder="Enter Role"
              className="w-full outline-none focus:ring focus:ring-green-500 rounded-xl pl-12 py-1 transition"
              onChange={(e) => { setRole(e.target.value) }} value={role} />
          </div>
          <div className="relative  ">
            <FaBriefcase className=" absolute top-2 left-4  text-green-400 text-xl " />
            <input type="text" placeholder="Experience (e.g. 2 years)"
              className="w-full outline-none focus:ring focus:ring-green-500 rounded-xl pl-12 py-1   transition"
              onChange={(e) => { setExperience(e.target.value) }} value={experience} />


          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              onChange={(e) => { setMode(e.target.value) }}
              name="mode" className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring focus:ring-green-500 outline-none transition">
              <option value="Technical">Technical Mode</option>
              <option value="HR">HR Mode</option>
            </select>
            
            <select
              onChange={(e) => { setNumberOfQuestions(e.target.value) }}
              value={numberOfQuestions}
              name="numberOfQuestions" className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring focus:ring-green-500 outline-none transition">
              <option value="3">3 Questions (Quick)</option>
              <option value="5">5 Questions (Standard)</option>
              <option value="7">7 Questions (Detailed)</option>
              <option value="10">10 Questions (Deep Dive)</option>
            </select>
          </div>
          {!analysisDone && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => document.getElementById("resumeUpload").click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer 
            hover:border-green-500 hover:bg-green-50 transition ">
              <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3" />
              <input type="file"
                accept="application/pdf"
                id="resumeUpload"
                className="hidden"
                onChange={(e) => { setResumefile(e.target.files[0]) }} />
              <p className="text-gray-600 font-medium">
                {resumeFile ? resumeFile.name : "Click to resume upload (optional) "}
              </p>
              {resumeFile && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadResume()
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="mt-4 bg-gray-900 cursor-pointer text-white
                px-2 rounded-lg hover:bg-gray-800 transition">
                  {analyzing ? "Analyzing..." : "Analyze Resume"}

                </motion.button>
              )}
            </motion.div>
          )}
          {analysisDone && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}

              className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Resume Analysis  Result</h3>
              {projects.length > 0 ? projects.length : 0}<br></br>
              {skills.length > 0 ? skills.length : 0}
              {projects.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    Project: </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {projects.map((p, i) => {
                      return <li key={i}> {p}</li>
                    })}
                  </ul>

                </div>
              )}
              {skills.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">
                    Skills: </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((p, i) => {
                      return <span className=" bg-yellow-300 rounded-full text-green-700  py-1 px-3 text-sm" key={i}> {p}</span>
                    })}
                  </div>

                </div>
              )}
            </motion.div>
          )}


          {startError && (
            <p className="text-red-600 text-sm text-center" role="alert">
              {startError}
            </p>
          )}
          <motion.button
            onClick={handleStart}
            disabled={
              !String(role ?? "").trim() ||
              !String(experience ?? "").trim() ||
              loading
            }
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full disabled:bg-gray-600 bg-gray-600
          hover:bg-gray-700 text-white py-3 rounded-full text-lg font-semibold
          transition duration-300 shadow-md">
            {loading ? " Starting..." : "Start Interview"}
          </motion.button>

        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1SetUp;