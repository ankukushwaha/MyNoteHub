import User from "../models/Users.js"
import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

router.post("/", (req,res) => {
    const {email, password} = req.body;
    User.findOne({email: email}).then((foundUser) => {
        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if (result === true) {
                    const token = jwt.sign({ id : foundUser._id }, process.env.JWT_SECRET);
                    // hiding password to sent with other informations 
                    const {password: pass, ...rest} = foundUser._doc;
                    res.cookie('access token', token, { httpOnly: true }).status(200).json(rest);
                }
                else{
                    res.status(500).json({error: "please enter correct credentials"}); 
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