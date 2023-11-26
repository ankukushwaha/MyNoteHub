import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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

const Note = mongoose.model('Note', NoteSchema);
export default Note;