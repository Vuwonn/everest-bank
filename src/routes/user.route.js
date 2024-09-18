import { Router } from "express";
import {userLogout, userRegister,userLogin, updateProfile, updateUser, getUserData} from "../controllers/user.controller.js";
import { userAuthenticate } from "../middlewares/jwtTocken.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";



const router = Router();

router.route("/register").post(userRegister);

router.route("/login").post(userLogin);

router.route("/updateUser").post(userAuthenticate,updateUser);

router.route("/updateProfile").post(userAuthenticate,upload.single('profile'),updateProfile);

router.route("/logout").post(userLogout);


router.route("/getUser").get(userAuthenticate,getUserData);



export default router