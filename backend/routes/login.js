import User from "../models/Users.js"
import bcrypt from "bcrypt";
import { Router } from "express";

const router = Router();

router.post("/", (req,res) => {
    const {username, email, password} = req.body;
    User.findOne({email: email, username: username}).then((foundUser) => {
        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if (result === true) {
                    res.status(201).json("login successfully");
                }
                else{
                    res.status(500).json({error: "please enter correct password"}); 
                }
            });
        }
        else{
            res.status(500).json({ error: "User not found. Please register first" });
        }
    })
    .catch((err) => {
        res.status(500).json({error: err.message});
    })
})

export default router;