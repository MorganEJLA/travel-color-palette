import { useState } from "react";

export function useInlineEdit(initialValue, onSave) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  function start(e) {
    e.stopPropagation();
    setEditing(true);
  }

  function cancel() {
    setValue(initialValue);
    setEditing(false);
  }

  async function save(e) {
    e?.stopPropagation();
    if (value.trim() && value.trim() !== initialValue) {
      await onSave(value.trim());
    }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") save(e);
    if (e.key === "Escape") cancel();
  }

  return { editing, value, setValue, start, save, cancel, handleKeyDown };
}
