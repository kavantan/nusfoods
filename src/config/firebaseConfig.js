import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { doc, getFirestore, runTransaction, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
  projectId: `${process.env.REACT_APP_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_MESSAGING_SENDER_ID}`,
  appId: `${process.env.REACT_APP_APP_ID}`,
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const firebaseAuth = getAuth(app);

export const googleAuthProvider = new GoogleAuthProvider();

// Initialize Firestore database
export const db = getFirestore(app);

export const storage = getStorage(app);

export const createUserDocument = async (user) => {
  const userRef = doc(db, "users", user.uid);

  await runTransaction(db, async (transaction) => {
    const sfDoc = await transaction.get(userRef);
    if (!sfDoc.exists()) {
      setDoc(userRef, { name: user?.displayName });
    }
  });
};
