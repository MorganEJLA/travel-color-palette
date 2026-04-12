import { useNavigate } from "react-router-dom";
import { COLOR_STRIP } from "../data/constants";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.colorStrip}>
        {COLOR_STRIP.map((c, i) => (
          <div
            key={i}
            className={styles.colorSegment}
            style={{ background: c }}
          />
        ))}
      </div>

      <nav className={styles.nav}>
        <span className={styles.logo} onClick={() => navigate("/")}>
          Chromaterra
        </span>
      </nav>

      <div className={styles.body}>
        <p className={styles.eyebrow}>Location not found</p>
        <h1 className={styles.headline}>404</h1>
        <p className={styles.description}>
          This place isn't on the map. The coordinates you followed don't lead
          anywhere we've charted yet.
        </p>
        <button className={styles.cta} onClick={() => navigate("/")}>
          Back to Atlas →
        </button>
      </div>

      <footer className={styles.footer}>
        <span>Chromaterra — Travel Color Atlas</span>
        <span>Vol. I</span>
      </footer>
    </div>
  );
}
