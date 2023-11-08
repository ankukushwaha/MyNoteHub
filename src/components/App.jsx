import React, { useState } from "react";
import Header from "./Header";
import Footer from "./footer";
import Note from "./Note";
import CreateArea from "./createArea";

function App() {
    const [addedItems, setAddedItems] = useState([])

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

  return (
    <div>
      <Header />
      <CreateArea click={onClick}/>
      {addedItems.map((items,index) => {
        return <Note key={index} id={index} Title={items.title} Content = {items.content} delete={handleDelete}/>
      })}
      <Footer />
    </div>
  );
}

export default App;
