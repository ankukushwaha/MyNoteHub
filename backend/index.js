import express from "express";
import notes from "./routes/notes.js";
import connectToDB from "./db.js";
import signup from "./routes/signup.js";
import login from "./routes/login.js";

const app = express();

// middleware 
app.use(express.json());

connectToDB();

app.use("/signup", signup);
app.use("/login", login);

app.use("/", notes);

app.listen(4000, (req,res) => {
    console.log("Server is listening to port 4000");
})

