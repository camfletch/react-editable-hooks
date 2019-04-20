/**
 * @class ExampleComponent
 */

import { useState, useCallback, useEffect } from "react";

export type EditableState<T> = {
  isEditing: boolean;
  editValue: T;
  setEditValue: (newValue: T) => void;
  onEditBegin: () => void;
  onEditConfirm: () => void;
  onEditCancel: () => void;
  hasDraft: boolean;
  useDraft: () => void;
};

export type UseEditableStateArguments<T> = {
  value: T;
  onValueChanged: (newValue: T) => void;
  localStorageKey?: string;
  serialize?: (value: T) => string;
  deserialize?: (serializedValue: string) => T;
};

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
    setEditValue(value);
    setIsEditing(true);
  }, [value]);

  const onEditConfirm = useCallback(() => {
    onValueChanged(editValue);
    setIsEditing(false);
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
      setHasDraft(false);
    }
  }, [editValue]);

  const onEditCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
      setHasDraft(false);
    }
  }, [value]);

  const useDraft = useCallback(() => {
    if (!localStorageKey) {
      return;
    }

    const draft = localStorage.getItem(localStorageKey);
    if (draft) {
      setIsEditing(true);
      setEditValue(deserialize(draft));
      localStorage.removeItem(localStorageKey);
      setHasDraft(false);
    }
  }, [localStorageKey]);

  const setEditValue = useCallback(
    (newValue: T) => {
      setEditValueRaw(newValue);
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, serialize(editValue));
        setHasDraft(true);
      }
    },
    [localStorageKey, editValue]
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
