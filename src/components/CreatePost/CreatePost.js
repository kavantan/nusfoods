import styles from "./CreatePost.module.css";
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

const CreatePost = () => {
  const { user } = useAuth();
  const [foodstores, setFoodstores] = useState([]);
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [foodStoreId, setFoodStoreId] = useState("");

  let navigate = useNavigate();

  const createPost = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText,
      foodStoreId,
      author: { name: user.displayName, id: user.uid },
      createdAt: serverTimestamp(),
      createdAtString: new Date().toLocaleString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    });
    navigate("/forum");
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
        </div>
        <button onClick={createPost}>Submit Post</button>
      </div>
    </div>
  );
};

export default CreatePost;
