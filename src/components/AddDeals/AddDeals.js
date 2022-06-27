import styles from "./AddDeals.module.css";
import { useState, useEffect } from "react";
import { addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  dealsCollectionRef,
  foodstoreCollectionRef,
} from "../../config/firebase.collections";
import { useAuth } from "../../hooks/useAuth.js";

const AddDeals = () => {
  const { user } = useAuth();
  const [foodstores, setFoodstores] = useState([]);
  const [deal, setDeal] = useState("");
  const [details, setDetails] = useState("");
  const [foodStoreId, setFoodStoreId] = useState("");

  let navigate = useNavigate();

  const createPost = async () => {
    await addDoc(dealsCollectionRef, {
      deal,
      details,
      foodStoreId,
      author: { name: user.displayName, id: user.uid },
    });
    navigate("/deals");
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
    <div className={styles.createDealPage}>
      <div className={styles.cpContainer}>
        <h1>Add New Deal</h1>
        <div className={styles.inputGp}>
          <label>Deal:</label>
          <input
            placeholder="Deal..."
            onChange={(event) => {
              setDeal(event.target.value);
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
          <label>Deal Details:</label>
          <textarea
            placeholder="Deal Details..."
            onChange={(event) => {
              setDetails(event.target.value);
            }}
          />
        </div>
        <button onClick={createPost}>Submit Deal</button>
      </div>
    </div>
  );
};

export default AddDeals;
