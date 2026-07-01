// import React from 'react'
// import { FaRobot } from "react-icons/fa";
// import { IoSparkles } from "react-icons/io5";
// import { motion } from "motion/react";
// import { FcGoogle } from "react-icons/fc";
// import { auth, provider } from '../utils/firebase';
// import { linkWithCredential, signInWithPopup } from "firebase/auth";
// import { ServerUrl } from '../App';
// import axios from "axios";
// import { useDispatch } from 'react-redux';
// import { setUserData } from '../redux/userSlice';


// function Auth({ isModel = false }) {
//     const dispatch = useDispatch();
//     const handleGoogleAuth = async () => {
//         try {

//             const response = await signInWithPopup(auth, provider);
//             console.log(response);
//             let User = response.user
//             let name = User.displayName
//             let email = User.email
//             const result = await axios.post(ServerUrl + "/api/auth/google",
//                 { name, email }, { withCredentials: true }
//             )
//             dispatch(setUserData(result.data))

//         } catch (err) {
//             console.log(err)
//             dispatch(setUserData(null))
//         }

//     }
//     return (
//         <div className={`w-full :${isModel ? "py-9" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}`}>
//             <motion.div

//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 6 }}
//                 transition={{ duration: 1.05 }}
//                 className={`w-full ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"} bg-white shadow-2xl border border-gray-200`}>
//                 <div className="max-w-md w-full p-8 rounded=3xl bg-white shadow-5xl  rounded-3xl border border-gray-200">
//                     <div className='flex item-center justify-center gap-3 mb-6' >
//                         <div className='bg-black text-white p-2 rounded-lg'>
//                             <FaRobot />
//                         </div>
//                         <h2 className='font-semibold text-lg '>Interview assist</h2>

//                     </div>
//                     <h1 className='text-2xl md:text-3xl font-sembold text-center loading-sug mb-4'>Continue with
//                         <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
//                             <IoSparkles size={16} />
//                             AI Smart Interview
//                         </span>
//                     </h1>
//                     <p className='text-gray-500 text-center text-sm md:text-base'>
//                         Sign in to start AI-powered mock interveiws, track your progress, and unlock detailed performanve insights
//                     </p>
//                     <motion.button
//                         onClick={handleGoogleAuth}
//                         whileHover={{ opacity: 0.9, scale: 1.05 }}
//                         whileTap={{ opacity: 0.2, scale: 0.95 }}
//                         className='flex w-full item-center justify-center py-3 gap-3 bg-black text-white rounded-full shadow-ms'
//                     >
//                         <FcGoogle size={22} /> Coninue with Google

//                     </motion.button>
//                 </div>

//             </motion.div>
//         </div >
//     )
// }

// export default Auth


import React from 'react'
import { FaRobot } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from '../utils/firebase';
import { signInWithPopup } from "firebase/auth";
import { ServerUrl } from '../App';
import axios from "axios";
import { AUTH_TOKEN_KEY } from '../axiosAuth.js';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth({ isModal = false }) {
    const dispatch = useDispatch();

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user;

            const result = await axios.post(
                ServerUrl + "/api/auth/google",
                {
                    name: user.displayName,
                    email: user.email
                },
                { withCredentials: true }
            );

            const { token: jwt, ...userFields } = result.data;
            if (jwt) {
                localStorage.setItem(AUTH_TOKEN_KEY, jwt);
            }
            dispatch(setUserData(userFields));
        } catch (err) {
            console.log(err);
            dispatch(setUserData(null));
        }
    };

    return (
        <div
            className={`w-full ${isModal
                    ? "py-9"
                    : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"
                }`}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`w-full ${isModal
                        ? "max-w-md p-8 rounded-3xl"
                        : "max-w-lg p-12 rounded-[32px]"
                    } bg-white shadow-xl border border-gray-200`}
            >
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="bg-black text-white p-2 rounded-lg">
                        <FaRobot />
                    </div>
                    <h2 className="font-semibold text-lg">Interview Assist</h2>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4">
                    Continue with{" "}
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2">
                        <IoSparkles size={16} />
                        AI Smart Interview
                    </span>
                </h1>

                {/* Description */}
                <p className="text-gray-500 text-center text-sm md:text-base mb-6">
                    Sign in to start AI-powered mock interviews, track your progress,
                    and unlock detailed performance insights.
                </p>

                {/* Button */}
                <motion.button
                    onClick={handleGoogleAuth}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex w-full items-center justify-center py-3 gap-3 bg-black text-white rounded-full shadow-md"
                >
                    <FcGoogle size={22} />
                    Continue with Google
                </motion.button>
            </motion.div>
        </div>
    );
}

export default Auth;