import User from "../models/Users.js"
import bcrypt from "bcrypt";
import { Router } from "express";

const router = Router();

// signup 
router.post("/", async(req,res) => {
    const {username, email, password} = req.body;
    // hashing and salting password through bcrypt.js 
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;