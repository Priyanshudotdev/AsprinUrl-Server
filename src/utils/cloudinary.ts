import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    
    return response;
  } catch (error) {

    // Remove the locally saved temporary file as the upload operation failed
    fs.unlinkSync(localFilePath);

    return null; 
  }
};

export default uploadOnCloudinary;
