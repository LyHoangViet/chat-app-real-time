// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJ6n4gWX0I3o3ICCsVWDXmMl0eCC0UQuw",
  authDomain: "chat-real-time-66998.firebaseapp.com",
  projectId: "chat-real-time-66998",
  storageBucket: "chat-real-time-66998.firebasestorage.app",
  messagingSenderId: "867705386408",
  appId: "1:867705386408:web:d2143c5b0be0811617599d",
  measurementId: "G-FHKSV5KBNF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics();
const auth = getAuth();
const ggProvider = new GoogleAuthProvider(app);
const fbProvider = new FacebookAuthProvider(app);

export { app, analytics, auth, ggProvider, fbProvider };
