import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';

function Note(props) {
  return (
    <div className="note">
      <h1>{props.Title}</h1>
      <p>{props.Content}</p>
      <button onClick={() => {
        props.delete(props.id);
      }}><DeleteIcon /></button>
      <button onClick={() => {
        props.edit(props.note, props.id)
      }}><EditNoteIcon /></button>
    </div>
  );
}

export default Note;
