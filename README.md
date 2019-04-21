# react-editable-hooks

Hooks for managing editable field state in React.

## Example

https://camfletch.github.io/react-editable-hooks/

## Install

```bash
npm install --save react-editable-hooks
```

or

```bash
yarn add react-editable-hooks
```

## Features

- Unopinionated about UI, just manages edting state for you
- Written in TypeScript
- Automatically back-up editing state (drafts) to localStorage, and allow them to be loaded
- New external values won't blow away your editing state

## Usage

```tsx
import * as React from "react";
import { useEditableState } from "react-editable-hooks";

const EditableTextField = ({ value, onValueChanged }) => {
  const {
    onEditBegin, // Callback to initiate editing
    onEditConfirm, // Callback to complete editing
    onEditCancel, // Callback to cancel editing

    isEditing, // Boolean indicating whether the field is being edited
    editValue, // 'Temporary' value of the field during editing
    setEditValue, // Callback to set a new 'temporary' value during editing

    hasDraft, // Boolean indicating whether there is a 'draft' in localStorage
    useDraft // Callback to load the 'draft' from localStorage
  } = useEditableState({
    value, // The 'true' value of the field (eg. the last value we have received from server)
    onValueChanged, // Callback to save a new value (eg. to server)

    localStorageKey: "ui.drafts.my-test-field" // Key to save 'drafts' to localStorage
    serialize: editValue => editValue, // Function to serialize the editValue into a string
    deserialize: draftValue => draftValue, // Function to deserialize the editValue from a string
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

MIT © [camfletch](https://github.com/camfletch)
