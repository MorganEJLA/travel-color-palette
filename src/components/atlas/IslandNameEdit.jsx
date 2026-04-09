import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useInlineEdit } from "../../hooks/useInlineEdit";
import styles from "./IslandNameEdit.module.css";

export default function IslandNameEdit({ island, albumId, onRename }) {
  const { editing, value, setValue, start, save, handleKeyDown } =
    useInlineEdit(island.name, async (newName) => {
      const albumRef = doc(db, "albums", albumId);
      const snap = await getDoc(albumRef);
      const albumData = snap.data();
      const updatedIslands = albumData.islands.map((i) =>
        i.id === island.id ? { ...i, name: newName } : i,
      );
      await setDoc(albumRef, { ...albumData, islands: updatedIslands });
      onRename(newName);
    });

  if (editing) {
    return (
      <div style={styles.editRow} onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        <button onClick={save} className="ghostButton">
          Save
        </button>
      </div>
    );
  }

  return (
    <div style={styles.displayRow}>
      <span style={styles.islandName}>{island.name}</span>
      <button onClick={start} className="ghostButton">
        Edit
      </button>
    </div>
  );
}
