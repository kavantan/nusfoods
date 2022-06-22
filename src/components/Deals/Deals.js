import { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { foodstoreCollectionRef } from "../../config/firebase.collections";

const Deals = () => {
  const [foodstores, setFoodstores] = useState([]);

  useEffect(() => {
    getFoodstores();
  }, []); // Runs on first render, might change later

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
      <u1>
        {foodstores.map((foodstore) => (
          <>
            <h2> {foodstore.data.title}</h2>
            <li> {foodstore.data.desc} </li>
            <li>number of upvotes: {foodstore.data.upvotes}</li>
          </>
        ))}
      </u1>
    </div>
  );
};

export default Deals;
