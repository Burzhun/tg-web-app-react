import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc, query, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC20qCRpNZBg2CNs2kXx77702kx0HVyBu0",
  authDomain: "sklad-c33c8.firebaseapp.com",
  projectId: "sklad-c33c8",
  storageBucket: "sklad-c33c8.appspot.com",
  messagingSenderId: "228973298661",
  appId: "1:228973298661:web:a8aa7f0d660b603b45e50c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export const loadDataDB = async (table, where = null) => {
  const q = where ? query(collection(db, table), where) : query(collection(db, table));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export { db, storage };
