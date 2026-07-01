import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Bot, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const UnifiedHome = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-neutral-300">The Future of Career Preparation</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            Your AI-Powered <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Career Advantage
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto"
          >
            Elevate your professional journey with our all-in-one platform. Build ATS-optimized resumes and master your interviews with real-time AI feedback.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Resume Builder Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-3xl blur-xl transition-all duration-500 group-hover:bg-indigo-500/20" />
            <div className="relative h-full bg-neutral-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">AI Resume Builder</h3>
              <p className="text-neutral-400 mb-6">Create professional, ATS-friendly resumes tailored to your dream job. Get AI suggestions to highlight your best achievements.</p>
              
              <ul className="space-y-3 mb-8">
                {['Smart AI Text Generation', 'ATS Compatibility Checker', 'Multiple Premium Templates'].map((item, i) => (
                  <li key={i} className="flex items-center text-sm text-neutral-300">
                    <CheckCircle className="w-4 h-4 text-indigo-400 mr-3" /> {item}
                  </li>
                ))}
              </ul>

              <Link to="/resume-app" className="inline-flex items-center justify-center w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-colors">
                Build Resume <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>

          {/* AI Interview Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl blur-xl transition-all duration-500 group-hover:bg-purple-500/20" />
            <div className="relative h-full bg-neutral-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Bot className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">AI Mock Interviews</h3>
              <p className="text-neutral-400 mb-6">Practice with our realistic AI interviewer. Receive detailed feedback on your answers, tone, and body language.</p>
              
              <ul className="space-y-3 mb-8">
                {['Role-specific Question Banks', 'Real-time Audio/Video Analysis', 'Comprehensive Feedback Reports'].map((item, i) => (
                  <li key={i} className="flex items-center text-sm text-neutral-300">
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-3" /> {item}
                  </li>
                ))}
              </ul>

              <Link to="/interview-app" className="inline-flex items-center justify-center w-full py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 border border-white/5 transition-colors">
                Start Interview <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedHome;
