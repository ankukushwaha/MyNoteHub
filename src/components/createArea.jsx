import React from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';

function CreateArea(props) {

  return (
    <div className="create-note">
      <form>
        {props.isTrue && <input name="title" onChange={props.handleChange} value={props.items.title} placeholder="Title" />}
        <textarea onClick={props.handleClick} name="content" onChange={props.handleChange} value={props.items.content} placeholder="Take a note..." rows="1" />
        <Zoom in={props.isTrue}>
        <Fab onClick={(event) => {
            props.click(props.items);
            event.preventDefault();
            props.setItems({
                title:"",
                content:""
            })
        }}><AddCircleIcon /></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
