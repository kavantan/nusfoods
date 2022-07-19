import styles from "./EditProfile.module.css";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig.js";
import { v4 } from "uuid";

const AddStore = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [dir, setDir] = useState("");
  const [biography, setBiography] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [formErrors, setFormErrors] = useState({});
  let navigate = useNavigate();

  const getUser = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    setName(docSnap.data().name);
    setDir(docSnap.data().dir);
    setBiography(docSnap.data().biography);
    setDownloadURL(docSnap.data().downloadURL);
  };

  useEffect(() => {
    getUser(user);
  }, [user]);

  const [imageUpload, setImageUpload] = useState(null);

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `users/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setDownloadURL(url);
      });
    });
  };

  const updateProfile = async () => {
    setFormErrors(validate());
    if (Object.keys(validate()).length === 0) {
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, {
        name,
        dir,
        downloadURL,
        biography,
      });
      navigate("/profile");
    }
  };

  const validate = () => {
    const errors = {};
    if (!name) {
      errors.title = "Display name is required!";
    }
    if (!dir) {
      errors.dir = "Username is required!";
    }
    return errors;
  };

  return (
    <div className={styles.createDealPage}>
      {user ? (
        <div className={styles.cpContainer}>
          <h1>Edit Profile</h1>
          <div className={styles.inputGp}>
            <label>Display Name:</label>
            <input
              value={name}
              placeholder="Eg. Jacob"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <div className={styles.formValidation}>{formErrors.title}</div>
          </div>
          <div className={styles.inputGp}>
            <label>Username / Profile Directory:</label>
            <input
              value={dir}
              placeholder="Eg. kavan-tan"
              onChange={(event) => {
                setDir(event.target.value);
              }}
            />
            <div className={styles.formValidation}>{formErrors.dir}</div>
          </div>
          <div className={styles.inputGp}>
            <label>Display Picture (Optional):</label>
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
            <label>Biography / About Me:</label>
            <textarea
              value={biography}
              placeholder="Eg. Hi, I am Kavan, I like to eat."
              onChange={(event) => {
                setBiography(event.target.value);
              }}
            />
            <div className={styles.formValidation}>{formErrors.desc}</div>
          </div>
          <button onClick={updateProfile}>Submit Changes</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AddStore;
