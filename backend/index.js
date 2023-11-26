import express from "express";
import connectToDB from "./db.js";
import signup from "./routes/signup.js";
import login from "./routes/login.js";
import addNote from "./routes/addNotes.js";

const app = express();

// middleware 
app.use(express.json());

connectToDB();

app.use("/signup", signup);
app.use("/login", login);
app.use("/addnote", addNote);

app.listen(4000, (req,res) => {
    console.log("Server is listening to port 4000");
})

