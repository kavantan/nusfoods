import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { getDocs, limit, query } from "firebase/firestore";
import { foodstoreCollectionRef } from "../../config/firebase.collections";

const Home = () => {
  const [foodstores, setFoodstores] = useState([]);

  useEffect(() => {
    getFoodstores();
  }, []);

  const getFoodstores = () => {
    const q = query(foodstoreCollectionRef, limit(1));
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
    <div className={styles.homePage}>
      Featured store of the day!
      {foodstores.map((foodstore) => {
        return (
          <div className={styles.store}>
            <div className={styles.storeHeader}>
              <div className={styles.title}>{foodstore.data.title}</div>
            </div>
            <div className={styles.storeTextContainer}>
              {" "}
              {foodstore.data.desc}{" "}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
