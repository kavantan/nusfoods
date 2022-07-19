import styles from "./Profile.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import {
  usersCollectionRef,
  postsCollectionRef,
  foodstoreCollectionRef,
} from "../../config/firebase.collections";
import { db } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Profile = () => {
  const { user } = useAuth();
  const [usersData, setUsersData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [foodstores, setFoodstores] = useState([]);
  const [randstate, setRandstate] = useState(0);

  let navigate = useNavigate();

  const getUsers = () => {
    const q = query(usersCollectionRef);
    getDocs(q)
      .then((response) => {
        const fs = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setUsersData(fs);
      })
      .catch((error) => console.log(error.message));
  };

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
    setRandstate(randstate + 1);
    deleteDoc(doc(db, "posts", id));
  };

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

  useEffect(() => {
    getPosts();
    getUsers();
    getFoodstores();
  }, [randstate]);

  return (
    <div className={styles.profilePage}>
      {usersData.map((userData) => {
        return (
          userData.id === user.uid && (
            <>
              <div className={styles.displayName}>{userData.data.name}</div>
              <div>
                {posts.map((post) => {
                  return (
                    post.data.author.id === userData.id && (
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
                        <div>
                          {post.data.downloadURL !== "" ? (
                            <img
                              src={post.data.downloadURL}
                              alt="post"
                              className={styles.image}
                            />
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className={styles.postTextContainer}>
                          {post.data.postText}
                        </div>
                        <div className={styles.postedBy}>
                          Posted by {post.data.author.name} on{" "}
                          {post.data.createdAtString}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </>
          )
        );
      })}
    </div>
  );
};

export default Profile;
