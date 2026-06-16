import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCx7520JIQzYSM99iR8lSHshJAiyU_jm7s",
  authDomain: "student-marketplace-68d5c.firebaseapp.com",
  projectId: "student-marketplace-68d5c",
  storageBucket: "student-marketplace-68d5c.firebasestorage.app",
  messagingSenderId: "941121008979",
  appId: "1:941121008979:web:0e4c683282eed2e2745da6",
  measurementId: "G-VGV9GM1TVP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();