import { useNavigate } from "react-router-dom";
import DeleteButton from "../buttons/DeleteButton";
import styles from "./ProfileLocaleCard.module.css";

export default function ProfileLocaleCard({ locale, onShare, onDelete }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/profile/${locale.id}`)}
    >
      {/* Palette strip */}
      <div className={styles.paletteStrip}>
        {locale.palette?.map((swatch, i) => (
          <div
            key={i}
            title={swatch.name}
            className={styles.swatch}
            style={{ background: swatch.hex }}
          />
        ))}
      </div>

      <div className={styles.body}>
        <p className={styles.location}>
          {locale.islandName} — {locale.placeName}
        </p>
        <h2 className={styles.name}>{locale.name}</h2>
        <p className={styles.mood}>{locale.mood}</p>
        <div className={styles.swatchNames}>
          {locale.palette?.map((swatch, i) => (
            <span key={i} title={swatch.hex} className={styles.swatchName}>
              {swatch.name}
            </span>
          ))}
        </div>
      </div>

      <button
        className={styles.shareBtn}
        onClick={(e) => {
          e.stopPropagation();
          onShare();
        }}
      >
        Share to Atlas
      </button>

      <DeleteButton label={locale.name} variant="text" onDelete={onDelete} />
    </div>
  );
}
