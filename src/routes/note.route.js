import { Router } from "express";
import { userAuthenticate } from "../middlewares/jwtTocken.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createNote, deleteNote, getAllNotes, getAllUserNotes, updateNote } from "../controllers/note.controller.js";

const router = Router();


router.route("/createNote").post(userAuthenticate,upload.array('note', 10),createNote);

router.route("/updateNote/:id").post(userAuthenticate, updateNote); 

router.route("/deleteNote/:id").post(userAuthenticate,deleteNote)

router.route("/getAllNotes/:id").get(userAuthenticate,getAllNotes);

router.route("/getAllUserNotes").get(userAuthenticate,getAllUserNotes);

export default router