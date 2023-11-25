import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// adding database 
const mongoURL = process.env.MONGOURL;
const connectToDB = async() => {
    try {
        await mongoose.connect(mongoURL);
    } catch (error) {
        console.log(error);
        res.status(404).json(error.message);
    }
}

export default connectToDB;


