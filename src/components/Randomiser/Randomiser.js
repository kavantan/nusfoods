import CloseIcon from "@mui/icons-material/Close";
import styles from "./Randomiser.module.css";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import {
  foodstoreCollectionRef,
  locationsCollectionRef,
} from "../../config/firebase.collections";
import { useNavigate } from "react-router-dom";

const Randomiser = ({ open, onClose }) => {
  const [foodstores, setFoodstores] = useState([]);
  const [locations, setLocations] = useState([]);
  const [checked, setChecked] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if (open) {
      getFoodstores();
      getLocations();
    }
  }, [open]);

  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  const getLocations = () => {
    getDocs(locationsCollectionRef)
      .then((response) => {
        const fs = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setLocations(fs);
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
                Randomiser Filter (Click to Include in Search):
                <div className={styles.checkboxes}>
                  {locations.map((location) => (
                    <div>
                      <input
                        value={location.id}
                        type="checkbox"
                        onChange={handleCheck}
                      />
                      <span>{location.id}</span>
                    </div>
                  ))}
                </div>
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
