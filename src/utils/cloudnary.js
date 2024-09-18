import { v2 as cloudinary } from 'cloudinary';
import { promises as fsPromises } from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryUpload = async (localFile) => {
    try {
        if (!localFile) return null;

        const response = await cloudinary.uploader.upload(localFile, {
            resource_type: "auto",
        });

        await fsPromises.unlink(localFile);  // Delete local file after successful upload
        return { response, localFileDeleted: true }; // Indicate that file was deleted
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);

        // Check if the file exists before trying to delete
        const fileExists = await fsPromises.stat(localFile).catch(() => false);
        if (fileExists) {
            try {
                await fsPromises.unlink(localFile);
            } catch (unlinkError) {
                console.error('Error deleting local file:', unlinkError);
            }
        } else {
            console.log('File does not exist for deletion:', localFile);
        }

        return { response: null, localFileDeleted: fileExists }; // Return if file was deleted or not
    }
};

export const uploadMultipleFiles = async (files) => {
    if (!Array.isArray(files) || files.length === 0) {
        return null;
    }

    const cloudinaryResponses = [];
    const filePaths = files.map(file => path.resolve(file.path));
    let responses = [];

    try {
        
        const uploadPromises = files.map(file => {
            return cloudinaryUpload(file.path);
        });

        responses = await Promise.all(uploadPromises);

        const successfulUploads = responses.filter(res => res.response);
        cloudinaryResponses.push(...successfulUploads.map(res => res.response));
    } catch (error) {
        console.error('Error uploading files:', error);
    } finally {

        const deletionPromises = filePaths.map(async (filePath, index) => {
            const fileStatus = responses[index];
            if (!fileStatus.localFileDeleted) { 
                try {
                    await fsPromises.access(filePath);  
                    await fsPromises.unlink(filePath); 
                    console.log('Local file deleted:', filePath);
                } catch (unlinkError) {
                    if (unlinkError.code === 'ENOENT') {
                        console.log('File does not exist for deletion:', filePath);
                    } else {
                        console.error('Error deleting local file:', unlinkError);
                    }
                }
            }
        });

        await Promise.all(deletionPromises);  
    }

   
    return cloudinaryResponses.map(response => response.url);
};

export default cloudinaryUpload;
