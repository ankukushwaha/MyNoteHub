import { Router } from "express";
import Note from "../models/Note.js";
import authenticateUser from "../middleware/fetchUser.js";

// add note 
const router = Router();
router.use(authenticateUser);
router.post("/", async(req,res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const {title, content , tag} = req.body;
    const newNote = new Note({user: req.user, title, content, tag });
    try {
        await newNote.save();
        res.status(201).json({ message: "Note added successfully", user_id: req.user });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;