import { Router } from "express";
import authenticateUser from "../middleware/fetchUser.js";
import Note from "../models/Note.js";

const router = Router();
router.delete("/:id", authenticateUser, async(req,res) => {
    if(!req.user){return res.status(401).json({error: "Unauthorized. Please log in."})};

    const notes = await Note.findById(req.params.id);
    if(!notes){return res.status(404).send("Not found")};

    if(notes.user.toString() !== req.user){return res.status(401).send("Not allowed")};

    Note.findByIdAndDelete(req.params.id).then(() => res.json(notes))
    .catch((err) => res.json({err}));
})

export default router;