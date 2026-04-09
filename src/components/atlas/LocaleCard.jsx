import { useNavigate } from "react-router-dom";

import DeleteButton from "../buttons/DeleteButton";
import styles from "./LocaleCard.module.css";

export default function LocaleCard({
  locale,
  island,
  albumId,
  user,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/${albumId}/${island.id}/${locale.id}`)}
    >
      {/* Color strip */}
      <div className={styles.colorStrip}>
        {locale.palette.slice(0, 3).map((s, i) => (
          <div
            key={i}
            className={styles.colorSegment}
            style={{ background: s.hex }}
          />
        ))}
      </div>

      <div className={styles.body}>
        <h2 className={styles.name}>{locale.name}</h2>
        <p className={styles.mood}>{locale.mood}</p>
        {user && (
          <DeleteButton
            label={locale.name}
            variant="text"
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}
