import AppShell from "./components/AppShell";
import PageHome from "./pages/PageHome";
import PageProfile from "./pages/PageProfile";
import PageDeals from "./pages/PageDeals";
import PageForum from "./pages/PageForum";
import PageCreatePost from "./pages/PageCreatePost";
import PageStores from "./pages/PageStores";
import PageStoreDetails from "./pages/PageStoreDetails";
import PageAddDeals from "./pages/PageAddDeals";
import PageAddStore from "./pages/PageAddStore";
import { Route, Routes } from "react-router-dom";

function App() {
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
        <Route path="/stores/:storeId" element={<PageStoreDetails />}></Route>
        <Route path="/adddeal" element={<PageAddDeals />} />
        <Route path="/addstore" element={<PageAddStore />} />
      </Routes>
    </div>
  );
}

export default App;
