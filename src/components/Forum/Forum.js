import styles from "./Forum.module.css";
import { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth.js";
import { db } from "../../config/firebaseConfig";
import { postsCollectionRef } from "../../config/firebase.collections";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";

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
    <div className={styles.forumPage}>
      {user ? (
        <div className={styles.button}>
          <Button variant="contained">
            <NavLink className={styles.button} to="/createpost">
              Post a new review
            </NavLink>
          </Button>
        </div>
      ) : (
        <></>
      )}
      {posts.map((post) => {
        return (
          <div className={styles.post}>
            <div className={styles.postHeader}>
              <div className={styles.title}>{post.data.title}</div>
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
            <div className={styles.postedBy}>
              <pre>
                Posted by user: {post.data.author.name}
                {"           "}
                {post.data.createdAtString}
              </pre>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Forum;
