import { useState, useCallback, useEffect } from "react";

export interface EditableState<T> {
  isEditing: boolean;
  editValue: T;
  setEditValue: (newValue: T) => void;
  onEditBegin: () => void;
  onEditConfirm: () => void;
  onEditCancel: () => void;
  hasDraft: boolean;
  useDraft: () => void;
}

export interface UseEditableStateArguments<T> {
  value: T;
  onValueChanged: (newValue: T) => void;
  localStorageKey?: string;
  serialize?: (value: T) => string;
  deserialize?: (serializedValue: string) => T;
}

export function useEditableState<T>({
  value,
  onValueChanged,
  localStorageKey,
  serialize = JSON.stringify,
  deserialize = JSON.parse
}: UseEditableStateArguments<T>): EditableState<T> {
  const [editValue, setEditValueRaw] = useState<T>(value);
  const [isEditing, setIsEditing] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  const onEditBegin = useCallback(() => {
    setEditValueRaw(value);
    setIsEditing(true);
  }, [value]);

  const onEditConfirm = useCallback(() => {
    onValueChanged(editValue);
    setIsEditing(false);
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
      setHasDraft(false);
    }
  }, [editValue, localStorageKey, onValueChanged]);

  const onEditCancel = useCallback(() => {
    setEditValueRaw(value);
    setIsEditing(false);
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
      setHasDraft(false);
    }
  }, [localStorageKey, value]);

  const useDraft = useCallback(() => {
    if (!localStorageKey) {
      return;
    }

    const draft = localStorage.getItem(localStorageKey);
    if (draft) {
      setIsEditing(true);
      setEditValueRaw(deserialize(draft));
      localStorage.removeItem(localStorageKey);
      setHasDraft(false);
    }
  }, [deserialize, localStorageKey]);

  const setEditValue = useCallback(
    (newValue: T) => {
      setEditValueRaw(newValue);
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, serialize(editValue));
        setHasDraft(true);
      }
    },
    [localStorageKey, serialize, editValue]
  );

  useEffect(() => {
    const draftExists = !!(
      !isEditing &&
      localStorageKey &&
      localStorage.getItem(localStorageKey)
    );
    setHasDraft(draftExists);
  }, [isEditing, localStorageKey]);

  return {
    onEditBegin,
    onEditConfirm,
    onEditCancel,
    isEditing,
    editValue,
    setEditValue,
    useDraft,
    hasDraft
  };
}
