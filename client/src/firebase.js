// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rapid-reach-90f06.firebaseapp.com",
  projectId: "rapid-reach-90f06",
  storageBucket: "rapid-reach-90f06.firebasestorage.app",
  messagingSenderId: "733874756800",
  appId: "1:733874756800:web:afedafe6c34d02a2afa125"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);