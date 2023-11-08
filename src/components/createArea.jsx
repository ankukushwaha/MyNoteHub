import React, { useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';

function CreateArea(props) {
    const [items, setItems] = useState({
        title: "",
        content: ""
    })

    function handleChange(event){
        const {name, value} = event.target;

        setItems((prevValue) => {
            return {
                ...prevValue,
                [name] : value
            }
        })
    }

    const [isTrue, setIsTrue] = useState(false);

    function handleClick(){
        setIsTrue(true);
    }

  return (
    <div className="create-note">
      <form>
        {isTrue && <input name="title" onChange={handleChange} value={items.title} placeholder="Title" />}
        <textarea onClick={handleClick} name="content" onChange={handleChange} value={items.content} placeholder="Take a note..." rows="1" />
        <Zoom in={isTrue}>
        <Fab onClick={(event) => {
            props.click(items);
            event.preventDefault();
            setItems({
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
