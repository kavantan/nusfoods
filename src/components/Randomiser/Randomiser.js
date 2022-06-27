import CloseIcon from "@mui/icons-material/Close";
import styles from "./Randomiser.module.css";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { foodstoreCollectionRef } from "../../config/firebase.collections";
import { useNavigate } from "react-router-dom";

const Randomiser = ({ open, onClose }) => {
  const [foodstores, setFoodstores] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if (open) {
      getFoodstores();
    }
  }, [open]);

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
      {open ? (
        <div className={styles.overlay} onClick={onClose}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={styles.randomContainer}
          >
            <div className={styles.randomRight}>
              <p className={styles.closeBtn} onClick={onClose}>
                <CloseIcon />
              </p>
              <div className={styles.content}>
                Can't choose what to eat? Look no further!
              </div>
              <div className={styles.btnContainer}>
                <button
                  className={styles.btnPrimary}
                  onClick={() => {
                    navigate(
                      "/stores/" +
                        foodstores[
                          Math.floor(Math.random() * (foodstores.length + 1))
                        ].data.dir
                    );
                    onClose();
                  }}
                >
                  Take me to a random food store!
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Randomiser;
