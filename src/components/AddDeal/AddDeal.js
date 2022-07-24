import styles from "./AddDeal.module.css";
import { useState, useEffect } from "react";
import { addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  dealsCollectionRef,
  foodstoreCollectionRef,
} from "../../config/firebase.collections";

const AddDeal = () => {
  const [foodstores, setFoodstores] = useState([]);
  const [deal, setDeal] = useState("");
  const [details, setDetails] = useState("");
  const [foodStoreId, setFoodStoreId] = useState("");
  const [formErrors, setFormErrors] = useState({});

  let navigate = useNavigate();

  const createPost = async () => {
    setFormErrors(validate());
    if (Object.keys(validate()).length === 0) {
      await addDoc(dealsCollectionRef, {
        deal,
        details,
        foodStoreId,
      });
      navigate("/deals");
    }
  };

  const validate = () => {
    const errors = {};
    if (!deal) {
      errors.deal = "Deal is required!";
    }
    if (!details) {
      errors.details = "Deal details is required!";
    }
    if (!foodStoreId) {
      errors.foodStoreId = "Food store is required!";
    }
    return errors;
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
            placeholder="Eg. 25% Off on selected Noodle Dishes"
            onChange={(event) => {
              setDeal(event.target.value);
            }}
          />
          <div className={styles.formValidation}>{formErrors.deal}</div>
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
          <div className={styles.formValidation}>{formErrors.foodStoreId}</div>
        </div>
        <div className={styles.inputGp}>
          <label>Deal Details:</label>
          <textarea
            placeholder="Eg. 25% Off on selected noodle items: DanDanMian, Beef Noodles, Chinese Noodles"
            onChange={(event) => {
              setDetails(event.target.value);
            }}
          />
          <div className={styles.formValidation}>{formErrors.details}</div>
        </div>
        <button onClick={createPost}>Submit Deal</button>
      </div>
    </div>
  );
};

export default AddDeal;
