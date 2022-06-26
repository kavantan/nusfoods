import styles from "./Home.module.css";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.button}>
        <Button variant="contained">
          <NavLink className={styles.button} to="/stores">
            Check out the stores!
          </NavLink>
        </Button>
      </div>
    </div>
  );
};

export default Home;
