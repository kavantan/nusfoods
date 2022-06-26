import { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { foodstoreCollectionRef } from "../../config/firebase.collections";

const Stores = () => {
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
    <div>
      {foodstores.map((foodstore) => (
        <>
          <h1> {foodstore.data.title}</h1>
          <h2> {foodstore.data.desc} </h2>
        </>
      ))}
    </div>
  );
};

export default Stores;
