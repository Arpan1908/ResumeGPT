// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "resume-d5d97.firebaseapp.com",
  projectId: "resume-d5d97",
  storageBucket: "resume-d5d97.appspot.com",
  messagingSenderId: "798140682356",
  appId: "1:798140682356:web:f031d22553f85651638121",
  measurementId: "G-T4QW5WD0ZL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const initFirebase = () => {
  return app;
};

export const database = getAuth(app);
