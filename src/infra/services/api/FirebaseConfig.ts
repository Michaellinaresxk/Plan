// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: 'plan-busines.firebaseapp.com',
  projectId: 'plan-busines',
  storageBucket: 'plan-busines.firebasestorage.app',
  messagingSenderId: '210649514275',
  appId: '1:210649514275:web:bb7ca53322aa6f7992cc96',
  measurementId: 'G-QSV3RFQVM1',
};

// init firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// init services
const db = getFirestore(app);

const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, signInWithEmailAndPassword, storage };
