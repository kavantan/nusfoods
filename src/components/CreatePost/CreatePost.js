import styles from "./CreatePost.module.css";
import { useState } from "react";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { postsCollectionRef } from "../../config/firebase.collections";
import { useAuth } from "../../hooks/useAuth.js";

const CreatePost = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  let navigate = useNavigate();

  const createPost = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText,
      author: { name: user.displayName, id: user.uid },
      createdAt: serverTimestamp(),
    });
    navigate("/forum");
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
