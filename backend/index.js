import express from "express";
import connectToDB from "./db.js";
import signup from "./routes/signup.js";
import login from "./routes/login.js";
import addNote from "./routes/addNotes.js";
import fetchNotes from "./routes/fetchNotes.js";
import updateNotes from "./routes/updateNote.js";
import deleteNotes from "./routes/deleteNote.js";
import cors from "cors";

const app = express();
app.use(cors());

// middleware 
app.use(express.json());

connectToDB();

app.use("/signup", signup);
app.use("/login", login);
app.use("/addnote", addNote);
app.use("/fetchnotes", fetchNotes);
app.use("/update", updateNotes);
app.use("/delete", deleteNotes)

app.listen(4000, (req,res) => {
    console.log("Server is listening to port 4000");
})

