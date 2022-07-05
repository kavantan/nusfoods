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
  const [formErrors, setFormErrors] = useState({});

  let navigate = useNavigate();

  const createPost = async () => {
    setFormErrors(validate());
    if (Object.keys(validate()).length === 0) {
      await addDoc(foodstoreCollectionRef, {
        title,
        desc,
        dir,
        author: { name: user.displayName, id: user.uid },
      });
      navigate("/stores");
    }
  };

  const validate = () => {
    const errors = {};
    if (!title) {
      errors.title = "Title is required!";
    }
    if (!desc) {
      errors.desc = "Description is required!";
    }
    if (!dir) {
      errors.dir = "Directory is required!";
    }
    return errors;
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
          <div className={styles.formValidation}>{formErrors.title}</div>
        </div>
        <div className={styles.inputGp}>
          <label>Store Directory (For webpage):</label>
          <input
            placeholder="Eg. deck-vegetarian"
            onChange={(event) => {
              setDir(event.target.value);
            }}
          />
          <div className={styles.formValidation}>{formErrors.dir}</div>
        </div>
        <div className={styles.inputGp}>
          <label>Store Description:</label>
          <textarea
            placeholder="Eg. Vegetarian Store at the Deck"
            onChange={(event) => {
              setDesc(event.target.value);
            }}
          />
          <div className={styles.formValidation}>{formErrors.desc}</div>
        </div>
        <button onClick={createPost}>Submit Store</button>
      </div>
    </div>
  );
};

export default AddStore;
