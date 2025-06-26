import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB60lODfzrSaK1aMz-JlQ66qGk8dvh9mL0",
  authDomain: "noorchat-3a26e.firebaseapp.com",
  projectId: "noorchat-3a26e",
  storageBucket: "noorchat-3a26e.firebasestorage.app",
  messagingSenderId: "1031540570163",
  appId: "1:1031540570163:web:8a53b0b06208e640d3cb46"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore, serverTimestamp };
