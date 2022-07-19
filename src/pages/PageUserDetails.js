import UserDetails from "../components/UserDetails";
import { useParams } from "react-router-dom";

const PageUserDetails = () => {
  const { username } = useParams();
  return (
    <div>
      <UserDetails username={username} />
    </div>
  );
};

export default PageUserDetails;
