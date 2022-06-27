import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { getDocs, limit, query } from "firebase/firestore";
import {
  foodstoreCollectionRef,
  dealsCollectionRef,
} from "../../config/firebase.collections";
import { useAuth } from "../../hooks/useAuth.js";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, signInWithGoogle } = useAuth();
  const [deals, setDeals] = useState([]);
  const [foodstores, setFoodstores] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    getDeals();
    getFoodstores();
  }, []);

  const getDeals = () => {
    const q = query(dealsCollectionRef, limit(1));
    getDocs(q)
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
    <div className={styles.homePage}>
      {user ? (
        <></>
      ) : (
        <div className={styles.pleaseLogIn}>
          <Button
            variant="contained"
            onClick={signInWithGoogle}
            style={{
              backgroundColor: "#e1ad01",
            }}
          >
            Please Log In
          </Button>
        </div>
      )}
      <div className={styles.featured}>Featured Deal of the Day!</div>
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

export default Home;
