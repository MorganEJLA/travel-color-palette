import { useNavigate } from "react-router-dom";
import styles from "./ChromaterraWordmark.module.css";

export default function ChromaterraWordmark({ color = "#1A1A18" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className={styles.wordmark}
      style={{ color }}
    >
      Chromaterra
    </button>
  );
}
