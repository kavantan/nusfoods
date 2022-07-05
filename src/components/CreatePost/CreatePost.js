import styles from "./CreatePost.module.css";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import {
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  postsCollectionRef,
  foodstoreCollectionRef,
} from "../../config/firebase.collections";
import { useAuth } from "../../hooks/useAuth.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig.js";
import { v4 } from "uuid";

const CreatePost = () => {
  const { user } = useAuth();
  const [foodstores, setFoodstores] = useState([]);
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [foodStoreId, setFoodStoreId] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [formErrors, setFormErrors] = useState({});

  let navigate = useNavigate();

  const [imageUpload, setImageUpload] = useState(null);

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setDownloadURL(url);
      });
    });
  };

  const createPost = async () => {
    setFormErrors(validate());
    if (Object.keys(validate()).length === 0) {
      await addDoc(postsCollectionRef, {
        title,
        postText,
        foodStoreId,
        downloadURL,
        author: { name: user.displayName, id: user.uid },
        createdAt: serverTimestamp(),
        createdAtString: new Date().toLocaleString(),
      });
      navigate("/forum");
    }
  };

  const validate = () => {
    const errors = {};
    if (!title) {
      errors.title = "Title is required!";
    }
    if (!postText) {
      errors.postText = "Post Text is required!";
    }
    return errors;
  };

  useEffect(() => {
    getFoodstores();
  }, []);

  const getFoodstores = () => {
    const q = query(foodstoreCollectionRef, orderBy("title"));
    getDocs(q)
      .then((response) => {
        const fs = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setFoodstores(fs);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div className={styles.createPostPage}>
      <div className={styles.cpContainer}>
        <h1>Create A Post</h1>
        <div className={styles.inputGp}>
          <label>Title:</label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <div className={styles.formValidation}>{formErrors.title}</div>
        </div>
        <div className={styles.inputGp}>
          <label>Image (Optional):</label>
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
          <label>Food Store:</label>
          <select
            value={foodStoreId}
            onChange={(event) => {
              setFoodStoreId(event.target.value);
            }}
          >
            <option value=""></option>
            {foodstores.map((fs) => (
              <option value={fs.id}>{fs.data.title}</option>
            ))}
          </select>
        </div>
        <div className={styles.inputGp}>
          <label>Post:</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
          <div className={styles.formValidation}>{formErrors.title}</div>
        </div>
        <button onClick={createPost}>Submit Post</button>
      </div>
    </div>
  );
};

export default CreatePost;
