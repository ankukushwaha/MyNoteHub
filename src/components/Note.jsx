import React, {useRef,  useState, useEffect} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';

function Note(props) {
  const modalRef = useRef(null);
  const refClose = useRef(null);
  
  const [eItems, eSetItems] = useState({
    id:"",
    eTitle: "",
    eContent: "",
    eTag: ""
  })
  
  useEffect(() => {
    eSetItems({
      id: props.note._id,
      eTitle: props.note.title,
      eContent: props.note.content,
      eTag: props.note.tag,
    });
  }, [props.note]);


  function ehandleChange(event){
      const {name, value} = event.target;

      eSetItems((prevValue) => {
          return {
              ...prevValue,
              [name] : value
          }
      })
  }
  
  function handleEdit(currentNote){
    console.log("Editing note with ID:", currentNote._id);
    console.log("Editing note with note:", currentNote);
    modalRef.current.click();
  }
  
  function handleClick(){
    console.log(eItems)
    props.update(eItems.id, eItems.eTitle, eItems.eContent, eItems.eTag);
    refClose.current.click();
  }
 
  return (
    <>
    <div className="note">
      <h1>{props.note.title}</h1>
      <p>{props.note.content}</p>
      <p>{props.note.tag}</p>
      <button onClick={() => {
        props.delete(props.note._id);
      }}><DeleteIcon /></button>
      <button onClick={() => {
        handleEdit(props.note)
      }}><EditNoteIcon /></button>
    </div>

     <button type="button" className="btn btn-primary d-none"  ref={modalRef} data-bs-toggle="modal" data-bs-target={`#exampleModal-${props.note._id}`}>Launch Demo Modal</button>  

    <div className="modal fade" id={`exampleModal-${props.note._id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form>
              <input name="eTitle" onChange={ehandleChange} value={eItems.eTitle} placeholder="Title" />
              <textarea name="eContent" onChange={ehandleChange} value={eItems.eContent} placeholder="Take a note..." rows="1" />
              <input name="eTag" onChange={ehandleChange} value={eItems.eTag} placeholder="Tag" />
            </form>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" onClick={handleClick} className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
    </div>
    </>
  );
}

export default Note;
