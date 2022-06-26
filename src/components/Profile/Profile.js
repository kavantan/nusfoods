import styles from "./Profile.module.css";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className={styles.welcome}>Welcome back, {user?.displayName}</div>
  );
};

export default Profile;
