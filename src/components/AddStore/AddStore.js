import styles from "./AddStore.module.css";
import { useState } from "react";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { foodstoreCollectionRef } from "../../config/firebase.collections";
import { useAuth } from "../../hooks/useAuth.js";

const AddStore = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dir, setDir] = useState("");

  let navigate = useNavigate();

  const createPost = async () => {
    await addDoc(foodstoreCollectionRef, {
      title,
      desc,
      dir,
      author: { name: user.displayName, id: user.uid },
    });
    navigate("/stores");
  };

  return (
    <div className={styles.createDealPage}>
      <div className={styles.cpContainer}>
        <h1>Add New Food Store</h1>
        <div className={styles.inputGp}>
          <label>Store Name:</label>
          <input
            placeholder="Eg. Deck Vegetarian"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className={styles.inputGp}>
          <label>Store Directory (For webpage):</label>
          <input
            placeholder="Eg. deck-vegetarian"
            onChange={(event) => {
              setDir(event.target.value);
            }}
          />
        </div>
        <div className={styles.inputGp}>
          <label>Store Description:</label>
          <textarea
            placeholder="Eg. Vegetarian Store at the Deck"
            onChange={(event) => {
              setDesc(event.target.value);
            }}
          />
        </div>
        <button onClick={createPost}>Submit Store</button>
      </div>
    </div>
  );
};

export default AddStore;
