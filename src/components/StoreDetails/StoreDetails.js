import styles from "./StoreDetails.module.css";
import { useEffect, useState } from "react";
import {
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import {
  usersCollectionRef,
  dealsCollectionRef,
  foodstoreCollectionRef,
  postsCollectionRef,
} from "../../config/firebase.collections";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { useAuth } from "../../hooks/useAuth.js";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig.js";
import { v4 } from "uuid";
import Rating from "@mui/material/Rating";

const StoreDetails = ({ storeDir }) => {
  const { user } = useAuth();
  const [foodstores, setFoodstores] = useState([]);
  const [posts, setPosts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [postsOrDeals, setPostsOrDeals] = useState("Posts");

  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [randstate, setRandstate] = useState(0);

  const [downloadURL, setDownloadURL] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [imageUpload, setImageUpload] = useState(null);

  const [usersData, setUsersData] = useState([]);

  const [rating, setRating] = useState(0);

  let navigate = useNavigate();

  useEffect(() => {
    getFoodstores();
    getPosts();
    getDeals();
    getUsers();
  }, [randstate]);

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setDownloadURL(url);
      });
    });
  };

  const createPost = async (foodstore) => {
    setFormErrors(validate());
    if (Object.keys(validate()).length === 0) {
      setRandstate(randstate + 1);
      await addDoc(postsCollectionRef, {
        title,
        postText,
        foodStoreId: foodstore.id,
        downloadURL,
        author: { name: user.displayName, id: user.uid },
        createdAt: serverTimestamp(),
        createdAtString: new Date().toLocaleString(),
      });
    }
    setTitle("");
    setPostText("");
  };

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
    setRandstate(randstate + 1);
    deleteDoc(doc(postsCollectionRef, id));
  };

  const validate = () => {
    const errors = {};
    if (!title) {
      errors.title = "Title is required!";
    }
    if (!postText) {
      errors.postText = "Post text is required!";
    }
    return errors;
  };

  return (
    <>
      <div className={styles.storeDetailsPage}>
        <div className={styles.backToStores}>
          <Button
            variant="contained"
            size="medium"
            style={{ backgroundColor: "#e1ad01" }}
            onClick={() => navigate("/stores")}
          >
            Back to stores
          </Button>
        </div>

        {foodstores.map((foodstore) => {
          return (
            foodstore.data.dir === storeDir && (
              <>
                <div className={styles.storeTitle}>{foodstore.data.title}</div>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />

                <Rating name="disabled" value={rating} disabled />
                <div>5.0 by 3 people</div>
                <div>
                  {foodstore.data.downloadURL !== "" ? (
                    <img
                      src={foodstore.data.downloadURL}
                      alt="foodstore"
                      className={styles.image}
                    />
                  ) : (
                    <></>
                  )}
                </div>
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
                            <div>
                              {post.data.downloadURL !== "" ? (
                                <img
                                  src={post.data.downloadURL}
                                  alt="post"
                                  className={styles.image2}
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                            <div className={styles.postTextContainer}>
                              {post.data.postText}
                            </div>
                            <div className={styles.postedBy}>
                              {usersData.map((userData) => {
                                return (
                                  userData.id === post.data.author.id && (
                                    <div
                                      className={styles.clickable}
                                      onClick={() =>
                                        navigate(
                                          "../users/" + userData.data.dir
                                        )
                                      }
                                    >
                                      Posted by {userData.data.name} on{" "}
                                      {post.data.createdAtString}
                                    </div>
                                  )
                                );
                              })}
                            </div>
                          </div>
                        )
                      );
                    })}
                    {user ? (
                      <div className={styles.cpContainer}>
                        <h1>Leave a review!</h1>
                        <div className={styles.inputGp}>
                          <label>Title:</label>
                          <input
                            placeholder="Title..."
                            onChange={(event) => {
                              setTitle(event.target.value);
                            }}
                          />
                          <div className={styles.formValidation}>
                            {formErrors.title}
                          </div>
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
                          <label>Post:</label>
                          <textarea
                            placeholder="Post..."
                            onChange={(event) => {
                              setPostText(event.target.value);
                            }}
                          />
                          <div className={styles.formValidation}>
                            {formErrors.postText}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            createPost(foodstore);
                          }}
                        >
                          Submit Post
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
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
                    <div className={styles.endOfDeals}>- End of Deals -</div>
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
