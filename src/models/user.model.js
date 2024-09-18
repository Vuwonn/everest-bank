import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
        minlength: 3,
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone:{
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    colleges: {
        type: String,
        trim: true,
        enum:["butwal kalika","other"]
        
    },
    year: {
        type: String,
        enum: ["first", "second", "third", "fourth"]
    },
    faculty:{
        type: String,
        enum:["BBS","BCA","B.Ed"]

    },
    gender:{
        type: String,
        enum: ["male", "female", "others"]
    },

    profile: {
        type: String,
        
    }
},
{
    timestamps: true
});

 const User = mongoose.model("User", userSchema);

 export default User;

