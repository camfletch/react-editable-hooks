/**
 * @class ExampleComponent
 */

import { useState, useCallback } from "react";

export function useEditableState<T>(
  value: T,
  onValueChanged: (newValue: T) => void
) {
  const [editValue, setEditValue] = useState<T>(value);
  const [isEditing, setIsEditing] = useState(false);

  const onEditBegin = useCallback(() => {
    setEditValue(value);
    setIsEditing(true);
  }, [value]);
  const onEditConfirm = useCallback(() => {
    onValueChanged(editValue);
    setIsEditing(false);
  }, [editValue]);
  const onEditCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
  }, [value]);

  return {
    onEditBegin,
    onEditConfirm,
    onEditCancel,
    isEditing,
    editValue,
    setEditValue
  };
}
