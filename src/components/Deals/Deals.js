import styles from "./Deals.module.css";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { foodstoreCollectionRef } from "../../config/firebase.collections";

const Deals = () => {
  const [foodstores, setFoodstores] = useState([]);

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
          <div className={styles.post}>
            <div className={styles.postHeader}>
              <div className={styles.title}>{foodstore.data.title}</div>
            </div>
            <div className={styles.postTextContainer}>
              {foodstore.data.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Deals;
