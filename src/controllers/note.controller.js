import Note from "../models/note.model.js";
import { uploadMultipleFiles } from "../utils/cloudnary.js";


export const createNote = async (req, res) => {
  try {

    const { title, description, year, chapter } = req.body;
    const notes = req.files; 

    if (!Array.isArray(notes)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid files array" });
    }

    
    const cloudinaryResponses = await uploadMultipleFiles(notes);
    if (!cloudinaryResponses || cloudinaryResponses.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Image upload failed" });
    }
    
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }
    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });
    }
    if (!year) {
      return res
        .status(400)
        .json({ success: false, message: "Year is required" });
    }
    if (!notes || notes.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Notes are required" });
    }

    if(!cloudinaryResponses || cloudinaryResponses.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Image upload failed" });
    }

    const userid = req.id;

   
    const note = new Note({
      title,
      description,
      year,
      chapter,
      user: userid,
      note: cloudinaryResponses, 
    });

   
    await note.save();

    return res
      .status(200)
      .json({ success: true, message: "Note created successfully", note });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const noteid = req.params.id;

    const { title, description, year, chapter } = req.body;
    

    const updatedFields = {};

    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (year) updatedFields.year = year;
    if (chapter) updatedFields.chapter = chapter;

    const updatedNote = await Note.findByIdAndUpdate(
      noteid,
      { $set: updatedFields }, 
      { new: true } 
    );

    if (updatedNote) {
      return res.status(200).json({
        success: true,
        message: "Note updated successfully",
        note: updatedNote,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Note update failed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//delete post

export const deleteNote = async (req, res) => {
  try {
    const noteid = req.params.id;
    const deletedNote = await Note.findByIdAndDelete(noteid);
    if (deletedNote) {
      return res
        .status(200)
        .json({ success: true, message: "Note deleted successfully",deletedNote });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Note delete failed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//get all notes

export const getAllNotes = async (req, res) => {
  try {
    const userid = req.id;

    const notes = await Note.find({ user: userid })
    .populate({
      path: 'user',
      select: 'name email -_id profile',   
    })
    .sort({ createdAt: -1 });
       

    
    if (notes) {
      return res
        .status(200)
        .json({ success: true, message: "Notes fetched successfully", notes });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Notes fetch failed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//get all notes posted by all user 

export const getAllUserNotes = async (req, res) => {
  try {
    const notes = await Note.find()
    .populate({
      path: 'user',
      select: 'name email -_id profile',   
    })
    .sort({ createdAt: -1 });
    if (notes) {
      return res
        .status(200)
        .json({ success: true, message: "Notes fetched successfully", notes });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Notes fetch failed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
