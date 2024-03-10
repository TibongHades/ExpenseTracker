import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXroDhtps79_xraLM2w9V58qcqIFggTkM",
  authDomain: "midtermactivity-75ba5.firebaseapp.com",
  projectId: "midtermactivity-75ba5",
  storageBucket: "midtermactivity-75ba5.appspot.com",
  messagingSenderId: "511518623164",
  appId: "1:511518623164:web:4b2cfaea442aa2089bd7b9",
  measurementId: "G-FWRBXDK6F9"
};

initializeApp(firebaseConfig);

const db = getFirestore();
export default db