import React, {useEffect} from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import { useNavigate } from "react-router-dom";

function CreateArea(props) {
  const navigate = useNavigate();
  // get notes
  async function getNotes() {
    try {
      const response = await fetch(`https://mynotehub.onrender.com/fetchnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem('token')
        },
      });
  
      const json = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      props.setAddedItems(json);
    } catch (error) {
      console.error("Error fetching notes:", error);
      // Handle the error appropriately, e.g., show a message to the user
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      getNotes();
    }
    else{
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="create-note">
      <form>
        {props.isTrue && <input name="title" onChange={props.handleChange} value={props.items.title} placeholder="Title" required/>}
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
