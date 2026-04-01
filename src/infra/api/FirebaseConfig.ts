import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
 apiKey: "AIzaSyAv5SYiFQYRszMPd0i45UrUymjLtEd8DEw",
  authDomain: "plan-busines.firebaseapp.com",
  projectId: "plan-busines",
  storageBucket: "plan-busines.firebasestorage.app",
  messagingSenderId: "210649514275",
  appId: "1:210649514275:web:bb7ca53322aa6f7992cc96",
  measurementId: "G-QSV3RFQVM1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, signInWithEmailAndPassword, storage };
