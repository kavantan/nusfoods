import styles from "./Forum.module.css";
import { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth.js";
import { db } from "../../config/firebaseConfig";
import { postsCollectionRef } from "../../config/firebase.collections";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";

function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    const q = query(postsCollectionRef, orderBy("createdAt", "desc"));
    getDocs(q)
      .then((response) => {
        const fs = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setPosts(fs);
      })
      .catch((error) => console.log(error.message));
  };

  const deletePost = (id) => {
    deleteDoc(doc(db, "posts", id));
  };

  return (
    <>
      <button size="large" aria-label="create new post" color="inherit">
        <NavLink
          to="/createpost"
          style={{ textDecoration: "inherit", color: "inherit" }}
        >
          Post a new Review
        </NavLink>
      </button>
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
                    <Tooltip title="Delete">
                      <button
                        onClick={() => {
                          deletePost(post.id);
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>
              <div className={styles.postTextContainer}>
                {" "}
                {post.data.postText}{" "}
              </div>
              <pre style={{ fontWeight: "bold" }}>
                Posted by user: {post.data.author.name}
                {"           "}
                {post.data.createdAtString}
              </pre>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Forum;
