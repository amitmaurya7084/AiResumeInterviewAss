import { BsRobot } from "react-icons/bs";

function Footer() {
    return (
        <div className='bg-[#f3f3f3] flex justify-center px-4 pb-21 py-4 pt-10'>

            <div className='w-full max-w-6xl max-h-25 bg-white rounded-[24px] shadow-sm border border-gray-200 py-1 px-3 text-center'>

                <div className='flex justify-center items-center gap-3 mb-3'>
                    <div className='bg-black text-white p-2 rounded-lg'>
                        <BsRobot size={16} />
                    </div>

                    <h2 className='font-semibold'>InterviewIQ.AI</h2>
                </div>

                <p className='text-gray-500 text-sm max-w-xl mx-auto'>
                    AI-powered interview preparation platform designed to improve
                    communication skills, technical depth and professional confidence.
                </p>

            </div>
        </div>
    );
}

export default Footer;