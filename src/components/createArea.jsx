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
        {props.isTrue && <input name="tag" onChange={props.handleChange} value={props.items.tag} placeholder="Tag" />}
        <Zoom in={props.isTrue}>
        <Fab onClick={(event) => {
          const tagValue = props.items.tag.trim() === "" ? "general" : props.items.tag;
            props.click({
              ...props.items,
              tag: tagValue
            });
            event.preventDefault();
            props.setItems({
                title:"",
                content:"",
                tag: ""
            })
        }}><AddCircleIcon /></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
