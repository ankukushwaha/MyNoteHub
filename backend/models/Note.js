import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
    },
    tag: {
        type: String,
        default: "general"
    }
}, {timestamps: true});

export default NoteSchema;