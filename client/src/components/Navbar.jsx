import React, { useState } from 'react'
import { motion } from "framer-motion";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { AUTH_TOKEN_KEY } from '../axiosAuth.js';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel.jsx';



const Navbar = () => {
    const { userData } = useSelector((state) => state.user);
    const [showCreditPopUp, setShowCreditPopUp] = useState(false)
    const [showUserPopUp, setShowUserPopUp] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showAuth, setShowAuth] = useState(false)

    const handlelogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout",
                { withCredentials: true }
            )
            localStorage.removeItem(AUTH_TOKEN_KEY)
            dispatch(setUserData(null))
            setShowCreditPopUp(false)
            setShowUserPopUp(false)
            navigate("/")
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className='bg-[#f3f3f3] flex flex-col justify-center px-4 pt-6'>

            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center'
            >
                <div className='flex items-center gap-3 cursor-pointer '>
                    <div className='bg-black text-white p-2 rounded-lg '>
                        <BsRobot size={18} />

                    </div>
                    <h1 className='font-semibold hidden md:block text-lg'> InterviewIQ.AI </h1>
                </div>

                <div className='flex items-center gap-6 relative'>
                    <div className='relative'>
                        <button onClick={() => {
                            if (!userData) {
                                setShowAuth(true);
                                return;
                            }
                            setShowCreditPopUp(!showCreditPopUp);
                            setShowUserPopUp(false)
                        }} className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-amber-200 transition'>
                            <BsCoin size={20} />
                            {userData?.credit || 0}
                        </button>
                        {showCreditPopUp && (
                            <div className='absolute right-[50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50'>
                                <p className='text-sm text-gray-600 mb-4 not-only:'>
                                    Need more credit to continue Interview?
                                </p>
                                <button onClick={() => navigate("/pricing")} className='w-full bg-black text-white py-2 rounded-lg text-sm'> Buy More Credit</button>
                            </div>
                        )}
                    </div>

                    <div className='relative' >
                        <button onClick={() => {
                            if (!userData) {
                                setShowAuth(true);
                                return;
                            }
                            setShowUserPopUp(!showUserPopUp);
                            setShowCreditPopUp(false)
                        }} className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center'>
                            {userData ? userData?.name.slice(0, 1).toUpperCase()
                                : <FaUserAstronaut size={16} />}
                        </button>
                        {showUserPopUp && (
                            <div className='absolute right-[50px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded p-5 z-50'>
                                <p className='text-md text-blue-500 mb-1 font-medium'>
                                    {userData?.name}
                                </p>
                                <button onClick={() => navigate("/history")} className='w-full  text-left text-sm text-gray-600 py-2 rounded-lg hover:text-black'>
                                    Interview History</button>
                                <button onClick={handlelogout} className='w-full flex items-center gap-2  text-gray-600 py-2 rounded-lg hover:text-black'>
                                    <HiOutlineLogout size={16} /> Logout</button>
                            </div>
                        )}

                    </div>
                </div>

            </motion.div >
            {showAuth && <AuthModel onClose={() => { setShowAuth(false) }} />}

        </div >
    )
}

export default Navbar