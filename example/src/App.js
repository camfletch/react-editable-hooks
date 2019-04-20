import React, { useState } from "react";
import { useEditableState } from "react-editable-hooks";

const EditableTextField = ({ value, onValueChanged }) => {
  const {
    onEditBegin,
    onEditConfirm,
    onEditCancel,
    isEditing,
    editValue,
    setEditValue,
    useDraft,
    hasDraft
  } = useEditableState({
    value,
    onValueChanged,
    localStorageKey: "ui.drafts.my-test-field"
  });

  if (isEditing) {
    return (
      <div className="container">
        <input
          className="content"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
        />
        <div className="buttons">
          <button onClick={onEditConfirm}>Confirm</button>
          <button onClick={onEditCancel}>Cancel</button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="container">
          <div className="content">{value}</div>
          <div className="buttons">
            <button onClick={onEditBegin}>Edit</button>
          </div>
        </div>
        {hasDraft ? <button onClick={useDraft}>Load draft</button> : null}
      </div>
    );
  }
};

const App = () => {
  const [myValue, setMyValue] = useState("initial value");
  return (
    <div>
      <EditableTextField
        value={myValue}
        onValueChanged={newValue => setMyValue(newValue)}
      />
      <button onClick={() => setMyValue("a new initial value")}>
        Set new initial value
      </button>
    </div>
  );
};

export default App;
