import { Router } from "express";
import Note from "../models/Note.js";
import authenticateUser from "../middleware/fetchUser.js";

// fetch note 
const router = Router();
router.get("/",authenticateUser, async(req,res) => {
    try {
        const notes = await Note.find({user: req.user});
        res.json(notes);       
    } catch (error) {
        res.status(500).json({error});
    }
})

export default router;