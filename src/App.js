import AppShell from "./components/AppShell";
import PageHome from "./pages/PageHome";
import PageLogIn from "./pages/PageLogIn";
import PageProfile from "./pages/PageProfile";
import PageDeals from "./pages/PageDeals";
import PageForum from "./pages/PageForum";
import PageCreatePost from "./pages/PageCreatePost";
import PageStores from "./pages/PageStores";
import { useAuth } from "./hooks/useAuth";
import { Route, Routes } from "react-router-dom";

function App() {
  const { user } = useAuth();

  return (
    <div>
      <AppShell />
      <Routes>
        <Route path="/" element={user ? <PageHome /> : <PageLogIn />} />
        <Route path="profile" element={<PageProfile />} />
        <Route path="forum" element={<PageForum />} />
        <Route path="deals" element={<PageDeals />} />
        <Route path="createpost" element={<PageCreatePost />} />
        <Route path="stores" element={<PageStores />} />
      </Routes>
    </div>
  );
}

export default App;
