import { collection } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const foodstoreCollectionRef = collection(db, "foodstores");
export const postsCollectionRef = collection(db, "posts");
