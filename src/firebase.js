import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZCCsdc1AuojL72UplcPOOPxVTjz3yb8c",
  authDomain: "ready-refrigerator.firebaseapp.com",
  projectId: "ready-refrigerator",
  storageBucket: "ready-refrigerator.appspot.com",
  messagingSenderId: "350087850804",
  appId: "1:350087850804:web:fbe890b5a389eb7fc85361",
  measurementId: "G-4C995ENCYJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
