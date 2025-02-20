// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoLLnVW61BVq5hVxX310_nX6uef0njT1g",
  authDomain: "reactapp-2172a.firebaseapp.com",
  projectId: "reactapp-2172a",
  storageBucket: "reactapp-2172a.firebasestorage.app",
  messagingSenderId: "583115324478",
  appId: "1:583115324478:web:df7c0a12b4904f6b06a56f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;