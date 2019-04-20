import React, { useState } from "react";
import { useEditableState } from "react-editable-hooks";

const EditableTextField = ({ value, onValueChanged }) => {
  const {
    onEditBegin,
    onEditConfirm,
    onEditCancel,
    isEditing,
    editValue,
    setEditValue
  } = useEditableState(value, onValueChanged);

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
      <div className="container">
        <div className="content">{value}</div>
        <div className="buttons">
          <button onClick={onEditBegin}>Edit</button>
        </div>
      </div>
    );
  }
};

const App = () => {
  const [myValue, setMyValue] = useState("initial value");
  return (
    <EditableTextField
      value={myValue}
      onValueChanged={newValue => setMyValue(newValue)}
    />
  );
};

export default App;
