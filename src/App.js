import AppShell from "./components/AppShell";
import PageHome from "./pages/PageHome";
import PageProfile from "./pages/PageProfile";
import PageDeals from "./pages/PageDeals";
import PageForum from "./pages/PageForum";
import PageCreatePost from "./pages/PageCreatePost";
import PageStores from "./pages/PageStores";
import PageStoreDetails from "./pages/PageStoreDetails";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { foodstoreCollectionRef } from "./config/firebase.collections";

function App() {
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
      <AppShell />
      <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/profile" element={<PageProfile />} />
        <Route path="/forum" element={<PageForum />} />
        <Route path="/deals" element={<PageDeals />} />
        <Route path="/createpost" element={<PageCreatePost />} />
        <Route path="/stores" element={<PageStores />} />
        {foodstores.map((foodstore) => {
          return (
            <Route
              path={"stores/" + foodstore.data.dir}
              element={<PageStoreDetails />}
            />
          );
        })}
      </Routes>
    </div>
  );
}

export default App;
