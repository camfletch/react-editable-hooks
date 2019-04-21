# react-editable-hooks

> Hooks for managing editable field state

[![NPM](https://img.shields.io/npm/v/react-editable-hooks.svg)](https://www.npmjs.com/package/react-editable-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-editable-hooks
```

## Usage

```tsx
import * as React from "react";
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
      <>
        <input
          className="content"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
        />
        <button onClick={onEditConfirm}>Confirm</button>
        <button onClick={onEditCancel}>Cancel</button>
      </>
    );
  } else {
    return (
      <>
        <span>{value}</span>
        <button onClick={onEditBegin}>Edit</button>
        {hasDraft ? <button onClick={useDraft}>Load draft</button> : null}
      </>
    );
  }
};
```

## License

MIT © [cameronfletcher92](https://github.com/cameronfletcher92)
