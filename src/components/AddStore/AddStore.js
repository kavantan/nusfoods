import styles from "./AddStore.module.css";
import Button from "@mui/material/Button";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { foodstoreCollectionRef } from "../../config/firebase.collections";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig.js";
import { v4 } from "uuid";

const AddStore = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dir, setDir] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [location, setLocation] = useState("");
  const [formErrors, setFormErrors] = useState({});

  let navigate = useNavigate();

  const [imageUpload, setImageUpload] = useState(null);

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `stores/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setDownloadURL(url);
      });
    });
  };

  const createPost = async () => {
    setFormErrors(validate());
    if (Object.keys(validate()).length === 0) {
      await setDoc(doc(foodstoreCollectionRef, dir), {
        title,
        desc,
        dir,
        downloadURL,
        location,
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
    if (!location) {
      errors.location = "Location is required!";
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
          <label>Location:</label>
          <select
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
            }}
          >
            <option value=""></option>
            <option value="PGP">PGP</option>
            <option value="PGP">UTown</option>
            <option value="PGP">Techno</option>
          </select>
          <div className={styles.formValidation}>{formErrors.location}</div>
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
          <label>Store Image (Optional):</label>
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
          <Button
            variant="contained"
            component="span"
            onClick={uploadFile}
            style={{ backgroundColor: "#42413d" }}
          >
            Upload Image
          </Button>
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
