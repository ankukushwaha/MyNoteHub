import React, { useRef, useState } from "react";
import Header from "./Header";
import Footer from "./footer";
import Note from "./Note";
import CreateArea from "./createArea";
import Modal from "./modal";

function App() {
    const [addedItems, setAddedItems] = useState([])
    const [items, setItems] = useState({
      title: "",
      content: ""
    })

    const [eItems, eSetItems] = useState({
      eTitle: "",
      eContent: ""
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

    function ehandleChange(event){
        const {name, value} = event.target;

        eSetItems((prevValue) => {
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

    function onClick(val){
        setAddedItems((prevValue) => {
            return [...prevValue, val];
        });
    }

    function handleDelete(id){
        setAddedItems((prevValue) => {
            return prevValue.filter((value, index) => {
                return index !== id;
            })
        })
    }

    const modalRef = useRef(null);
    const [id, setId] = useState(null);

    function handleEdit(currentNote, index){
      modalRef.current.click();
      eSetItems({eTitle: currentNote.title, eContent: currentNote.content });
      setId(index);
    }

    function handleUpdate(id){
      setAddedItems((prevValue) => {
        return prevValue.map((item, index) => {
          if(index === id){
            return {title: eItems.eTitle, content: eItems.eContent};
          }
          else{
            return item;
          }
        })
      })
    }

  return (
    <div>
      <Header />
      <Modal modalRef={modalRef}  handleChange={ehandleChange} items={eItems} update={handleUpdate} index={id} />
      <CreateArea click={onClick} items={items} setItems={setItems} handleChange={handleChange} handleClick={handleClick} isTrue={isTrue}/>
      {addedItems.map((item,index) => {
        return <Note key={index} id={index} Title={item.title} Content = {item.content} delete={handleDelete} edit={handleEdit} note={item}/>
      })}
      <Footer />
    </div>
  );
}

export default App;
