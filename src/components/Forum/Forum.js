import styles from "./Forum.module.css";
import { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth.js";
import { db } from "../../config/firebaseConfig";
import { postsCollectionRef } from "../../config/firebase.collections";

function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []); // Runs on first render, might change later

  const getPosts = () => {
    getDocs(postsCollectionRef)
      .then((response) => {
        const fs = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setPosts(fs);
      })
      .catch((error) => console.log(error.message));
  };

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };

  return (
    <div className={styles.homePage}>
      {posts.map((post) => {
        return (
          <div className={styles.post}>
            <div className={styles.postHeader}>
              <div className={styles.title}>
                <h1> {post.data.title}</h1>
              </div>
              <div className={styles.deletePost}>
                {user && post.data.author.id === user.uid && (
                  <button
                    onClick={() => {
                      deletePost(post.data.id);
                    }}
                  >
                    {" "}
                    &#128465;
                  </button>
                )}
              </div>
            </div>
            <div className={styles.postTextContainer}>
              {" "}
              {post.data.postText}{" "}
            </div>
            <h3>Posted by User: {post.data.author.name}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default Forum;
