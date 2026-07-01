import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import authReducer from '../resume_app/features/authSlice.js'

export default configureStore({
    reducer: {
        user: userSlice, // From AiInterview
        auth: authReducer, // From Ai-resume-Builder
    },
})