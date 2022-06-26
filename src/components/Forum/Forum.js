import styles from "./Forum.module.css";
import { useEffect, useState } from "react";
import { getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth.js";
import { db } from "../../config/firebaseConfig";
import {
  postsCollectionRef,
  foodstoreCollectionRef,
} from "../../config/firebase.collections";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [foodstores, setFoodstores] = useState([]);
  let navigate = useNavigate();

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

  useEffect(() => {
    getFoodstores();
  }, []);

  const getFoodstores = () => {
    getDocs(foodstoreCollectionRef)
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
    <div className={styles.forumPage}>
      {user ? (
        <Button
          style={{
            borderRadius: 35,
            backgroundColor: "#e1ad01",
            padding: "14px 30px",
            fontSize: "17px",
          }}
          variant="contained"
        >
          <NavLink className={styles.text} to="/createpost">
            Post a new review
          </NavLink>
        </Button>
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
            <div className={styles.foodStore}>
              {foodstores.map((foodstore) => {
                return (
                  foodstore.id === post.data.foodStoreId && (
                    <div
                      className={styles.clickable}
                      onClick={() =>
                        navigate("../stores/" + foodstore.data.dir)
                      }
                    >
                      Store: {foodstore.data.title}
                    </div>
                  )
                );
              })}
            </div>
            <div className={styles.postTextContainer}>
              {" "}
              {post.data.postText}{" "}
            </div>
            <div className={styles.postedBy}>
              Posted by {post.data.author.name} on {post.data.createdAtString}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Forum;
