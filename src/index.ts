import { useState, useCallback, useEffect } from "react";

export interface EditableState<T> {
  /**
   * Whether the field is currently being edited. This should be used to
   * determine whether to render an input for the field, or just a static view.
   */
  isEditing: boolean;
  /**
   * The 'temporary' editing value for the field. This should be used as the value
   * for whatever input is being used for the field.
   */
  editValue: T;
  /**
   * Sets the current editValue. This should be to handle change events on whatever
   * input is being used for the field.
   */
  setEditValue: (newValue: T) => void;
  /**
   * Callback to be used when initiating an edit
   */
  onEditBegin: () => void;
  /**
   * Callback to be used when an edit is 'confirmed'/'saved'
   */
  onEditConfirm: () => void;
  /**
   * Callback to be used when editing is cancelled (eg. via ESC, or clicking a
   * 'cancel' button)
   */
  onEditCancel: () => void;
  /**
   * Whether the field has unsaved changes stored in a draft. Drafts exist when the
   * an edit is interrupted (via refresh for example). Drafts are cleared when an edit
   * is confirmed or cancelled.
   */
  hasDraft: boolean;
  /**
   * Loads a saved draft from local storage as the editValue for the field, and
   * initializes editing.
   */
  useDraft: () => void;
}

export interface UseEditableStateArguments<T> {
  /**
   * The 'true' value for the editable field (eg. from the server).
   */
  value: T;
  /**
   * Callback that sets the 'true' value for the field (after an edit has been
   * confirmed).
   */
  onValueChanged: (newValue: T) => void;
  /**
   * The key to use when saving 'drafts' to localStorage. A draft is saved as
   * the value is edited, and cleared when an edit is confirmed or cancelled.
   */
  localStorageKey?: string;
  /**
   * Function for serializing a field's value in order to save a draft to
   * localStorage.
   */
  serialize?: (value: T) => string;
  /**
   * Function for deserializing a field's value in order to load a draft from
   * localStorage
   */
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
