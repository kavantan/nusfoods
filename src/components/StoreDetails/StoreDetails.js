import styles from "./StoreDetails.module.css";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { foodstoreCollectionRef } from "../../config/firebase.collections";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const StoreDetails = ({ storeDir }) => {
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
              </>
            )
          );
        })}
      </div>
    </>
  );
};

export default StoreDetails;
