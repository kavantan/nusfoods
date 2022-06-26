import styles from "./Deals.module.css";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { foodstoreCollectionRef } from "../../config/firebase.collections";
import { useNavigate } from "react-router-dom";

const Deals = () => {
  const [foodstores, setFoodstores] = useState([]);
  let navigate = useNavigate();

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
    <div className={styles.dealsPage}>
      {foodstores.map((foodstore) => {
        return (
          <div
            className={styles.store}
            onClick={() => navigate("../stores/" + foodstore.data.dir)}
          >
            <div className={styles.storeHeader}>{foodstore.data.title}</div>
            <div className={styles.storeTextContainer}>
              {foodstore.data.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Deals;
