import styles from "./StoreDetails.module.css";
import { useEffect, useState } from "react";
import { getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import {
  dealsCollectionRef,
  foodstoreCollectionRef,
  postsCollectionRef,
} from "../../config/firebase.collections";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { useAuth } from "../../hooks/useAuth.js";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";

const StoreDetails = ({ storeDir }) => {
  const { user } = useAuth();
  const [foodstores, setFoodstores] = useState([]);
  const [posts, setPosts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [postsOrDeals, setPostsOrDeals] = useState("Posts");
  let navigate = useNavigate();

  useEffect(() => {
    getFoodstores();
    getPosts();
    getDeals();
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

  const getDeals = () => {
    getDocs(dealsCollectionRef)
      .then((response) => {
        const fs = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setDeals(fs);
      })
      .catch((error) => console.log(error.message));
  };

  const deletePost = (id) => {
    deleteDoc(doc(db, "posts", id));
  };

  return (
    <>
      <div className={styles.button}>
        <Button
          variant="contained"
          size="medium"
          style={{ backgroundColor: "#e1ad01" }}
          onClick={() => navigate("/stores")}
        >
          Back to stores
        </Button>
      </div>

      <div className={styles.storeDetailsPage}>
        {foodstores.map((foodstore) => {
          return (
            foodstore.data.dir === storeDir && (
              <>
                <div className={styles.storeTitle}>{foodstore.data.title}</div>
                <div className={styles.storeDesc}>{foodstore.data.desc}</div>
                <div>
                  <select
                    value={postsOrDeals}
                    onChange={(event) => {
                      setPostsOrDeals(event.target.value);
                    }}
                  >
                    <option value="Posts"> Show Posts</option>
                    <option value="Deals"> Show Deals</option>
                  </select>
                </div>
                {postsOrDeals === "Posts" ? (
                  <div>
                    {posts.map((post) => {
                      return (
                        foodstore.id === post.data.foodStoreId && (
                          <div className={styles.post}>
                            <div className={styles.postHeader}>
                              <div className={styles.title}>
                                {post.data.title}
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
                            <div className={styles.storeName}>
                              Store: {foodstore.data.title}
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
                ) : (
                  <div>
                    {deals.map((deal) => {
                      return (
                        foodstore.id === deal.data.foodStoreId && (
                          <div className={styles.deal}>
                            <div className={styles.dealHeader}>
                              <div className={styles.title}>
                                {deal.data.deal}
                              </div>
                            </div>
                            <div className={styles.storeName}>
                              Store: {foodstore.data.title}
                            </div>
                            <div className={styles.postTextContainer}>
                              {deal.data.details}
                            </div>
                          </div>
                        )
                      );
                    })}
                  </div>
                )}
              </>
            )
          );
        })}
      </div>
    </>
  );
};

export default StoreDetails;
