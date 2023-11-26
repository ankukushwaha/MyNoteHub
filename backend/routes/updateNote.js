import { Router } from "express";
import authenticateUser from "../middleware/fetchUser.js";
const router = Router();
import Note from "../models/Note.js";

router.put("/:id",authenticateUser, async(req,res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const {title, content, tag} = req.body;
    const newNote = {};
    if(title){newNote.title = title};
    if(content){newNote.content = content};
    if(tag){newNote.tag = tag};

    // find the note to be updated and update it 
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")};

    if(note.user.toString() != req.user){
        return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
    res.json({note});

})

export default router;