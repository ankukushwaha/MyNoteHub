import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';

function Note(props) {
  return (
    <div className="note">
      <h1>{props.Title}</h1>
      <p>{props.Content}</p>
      <button onClick={() => {
        props.delete(props.id);
      }}><DeleteIcon /></button>
    </div>
  );
}

export default Note;
