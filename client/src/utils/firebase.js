import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "interviewiq-a2b8b.firebaseapp.com",
    projectId: "interviewiq-a2b8b",
    storageBucket: "interviewiq-a2b8b.firebasestorage.app",
    messagingSenderId: "973724831200",
    appId: "1:973724831200:web:f7043218eb97f2c50d2f85"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider } 