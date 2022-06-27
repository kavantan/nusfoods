import styles from "./Deals.module.css";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import {
  dealsCollectionRef,
  foodstoreCollectionRef,
} from "../../config/firebase.collections";
import { useNavigate } from "react-router-dom";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [foodstores, setFoodstores] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    getDeals();
    getFoodstores();
  }, []);

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
      <div className={styles.featured}>Deals</div>
      {deals.map((deal) => {
        return (
          <div>
            {foodstores.map((foodstore) => {
              return (
                foodstore.id === deal.data.foodStoreId && (
                  <div
                    className={styles.store}
                    onClick={() => navigate("../stores/" + foodstore.data.dir)}
                  >
                    <div className={styles.storeTitle}>
                      {foodstore.data.title}
                    </div>
                    <div className={styles.storeHeader}>{deal.data.deal}</div>
                    <div className={styles.storeTextContainer}>
                      {" "}
                      {deal.data.details}
                    </div>
                  </div>
                )
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Deals;
