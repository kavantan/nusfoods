import CloseIcon from "@mui/icons-material/Close";
import styles from "./Randomiser.module.css";

const Randomiser = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} className={styles.overlay}>
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
            <button className={styles.btnPrimary}>
              Take me to a random food store!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Randomiser;
