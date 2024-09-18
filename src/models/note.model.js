import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
        minlength: 3,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        maxlength: 2000,
        trim: true,
        lowercase: true
    },
    year: {
        type: String,
        required: true,
        enum: ["first", "second", "third", "fourth"]
    },
    chapter: {
        type: String,
    },
    like:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    note:{
        type: [String],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},  
{
    timestamps: true
});

 const Note = mongoose.model("Note", noteSchema);

 export default Note;

