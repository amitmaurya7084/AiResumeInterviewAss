import React, { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import Auth from '../pages/Auth';

function AuthModel({ onClose }) {
    const { userData } = useSelector((state) => state.user);
    useEffect(() => {
        if (userData) {
            onClose()
        }
    }, [userData, onClose])
    return (
        <div className='fixed inset-0   flex    items-center justify-center bg-black/10 backdrop-blur-sm px-5'>
            <div className='relative   w-full max-w-md '>
                <button onClick={onClose} className='absolute top-2 right-2 text-gray-800 hover:text-black text-xl'>
                    <FaTimes size={38} />
                </button>
                <Auth isModel={true} />
            </div>

        </div>
    )
}

export default AuthModel
