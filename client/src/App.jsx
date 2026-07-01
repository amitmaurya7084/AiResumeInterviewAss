import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {Toaster} from 'react-hot-toast';

// --- Redux Actions ---
import { setUserData } from './redux/userSlice.js';
import { login, setLoading } from './resume_app/features/authSlice.js';

// --- API ---
import api from './resume_config/api.js';
export const ServerUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

// --- Resume Builder Pages ---
import { Home as ResumeHome } from './resume_pages/Home.jsx';
import { Dashboard as ResumeDashboard } from './resume_pages/Dashboard.jsx';
import { Layout as ResumeLayout } from './resume_pages/Layout.jsx';
import { ResumeBuilder } from './resume_pages/ResumeBuilder.jsx';
import { Login as ResumeLogin } from './resume_pages/Login.jsx';
import { Preview as ResumePreview } from './resume_pages/Preview.jsx';
import { AtsChecker } from './resume_pages/AtsChecker.jsx';

// --- Interview Pages ---
import InterviewHome from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import InterviewPage from './pages/interviewPage.jsx';
import InterviewHistory from './pages/InterviewHistory.jsx';
import Pricing from './pages/Pricing.jsx';
import InterviewReport from './pages/InterviewReport.jsx';

// --- Unified Home Page ---
import UnifiedHome from './pages/UnifiedHome.jsx';

import './App.css';

function App() {
  const dispatch = useDispatch();

  // --- Resume Builder Auth Check ---
  const getResumeUserData = async () => {
    const token = localStorage.getItem('token');
    try {
      if(token){
        const { data } = await api.get('/api/users/data', {headers: {Authorization: `Bearer ${token}`}});
        if(data.user){
            dispatch(login({token, user: data.user}));
        }
        dispatch(setLoading(false));
      } else {
          dispatch(setLoading(false));
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 404) {
        localStorage.removeItem('token');
      }
      dispatch(setLoading(false));
      console.log(error.response?.data || error.message);
    }
  };

  // --- Interview Auth Check ---
  const getInterviewUserData = async () => {
    try {
      const result = await axios.get(
        ServerUrl + "/api/user/current-user",
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
      dispatch(setUserData(null));
    }
  };

  useEffect(() => {
    getResumeUserData();
    getInterviewUserData();
  }, [dispatch]);

  return (
    <>
    <Toaster/>
    <Routes>
      <Route path='/' element={<UnifiedHome />} />
      
      {/* --- Interview Routes --- */}
      <Route path='/interview-app' element={<InterviewHome />} />
      <Route path='/Auth' element={<Auth />} />
      <Route path='/interview' element={<InterviewPage />} />
      <Route path='/history' element={<InterviewHistory />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/report/:id' element={<InterviewReport />} />

      {/* --- Resume Routes --- */}
      <Route path='/resume-app' element={<ResumeHome/>}/>
      <Route path='/resume-login' element={<ResumeLogin/>}/>
      <Route path='app' element={<ResumeLayout/>}>
        <Route index element={<ResumeDashboard/>}/>
        <Route path='builder/:resumeId' element={<ResumeBuilder/>}/>
        <Route path='ats-checker' element={<AtsChecker/>}/>
      </Route>
      <Route path='view/:resumeId' element={<ResumePreview/>}/>

    </Routes>
    </>
  );
}

export default App;