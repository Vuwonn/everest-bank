import jwt  from "jsonwebtoken";
import User  from "../models/user.model.js";
import bcrypt from "bcrypt";
import  uploadOnCloudinary  from "../utils/cloudnary.js";


export const userRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, phone });

    const savedUser = await user.save();

    if (savedUser) {
      return res
        .status(201)
        .json({ success: true, message: "User created successfully", user: savedUser });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const userLogin = async (req, res) => {
    try {
        const { email, password,phone } = req.body;

        if ((!email && !phone) || !password) {
            return res
              .status(400)
              .json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({
            $or: [{ email: email }, { phone: phone }]
          });
          
        if (!user) {
            return res
              .status(400)
              .json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
              .status(400)
              .json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            sameSite: 'strict',
          });


        return res
          .status(200)
          .json({ success: true, message: "User logged in successfully", token });

        
    } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
        
    }
};


export const userLogout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res
          .status(200)
          .json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
    }
};

export const updateUser = async (req, res) => {
  try {
      // Get user ID
      const { name, phone, address, colleges, year, faculty, gender } = req.body;
      const userid = req.id;

      // Find the user by ID
      const user = await User.findById(userid);
      if (!user) {
          return res
            .status(400)
            .json({ success: false, message: "User does not exist" });
      }

      // Create an object to hold the updated fields
      const updatedFields = {};

      if (name) updatedFields.name = name;
      if (phone) updatedFields.phone = phone;
      if (address) updatedFields.address = address;
      if (colleges) updatedFields.colleges = colleges;
      if (year) updatedFields.year = year;
      if (faculty) updatedFields.faculty = faculty;
      if (gender) updatedFields.gender = gender;

      // Update the user with the conditionally updated fields
      const updatedUser = await User.findByIdAndUpdate(
          userid,
          { $set: updatedFields }, // only updates provided fields
          { new: true } // return the updated document
      );

      if (updatedUser) {
          return res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
      } else {
          return res.status(400).json({ success: false, message: "User update failed" });
      }

  } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    // Get the uploaded profile file
    const profile = req.file; 

    console.log(profile);
    

    if (!profile) {
      return res
        .status(400)
        .json({ success: false, message: "Profile image is required" });
    }

    // Check if the uploaded file is an image
    if (!profile.mimetype.startsWith("image")) {
      return res
        .status(400)
        .json({ success: false, message: "Profile image must be an image" });
    }

    // Upload the image to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(profile.path);
    console.log("Cloudinary Response:", cloudinaryResponse);

    if (!cloudinaryResponse || !cloudinaryResponse.url) {
      return res.status(400).json({ success: false, message: "Profile image upload failed" });
    }

    // Get the user ID from the request
    const userid = req.id;

    // Find the user by ID
    const user = await User.findById(userid);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    // Update the user's profile with the new image URL
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { $set: { profile: cloudinaryResponse.url } },
      { new: true } 
    );

    if (updatedUser) {
      return res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } else {
      return res.status(400).json({ success: false, message: "Profile update failed" });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const getUserData = async (req, res) => {
  try {
    const userid = req.id;
    const user = await User.findById(userid);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }

};
