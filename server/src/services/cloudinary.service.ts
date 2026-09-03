import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadPaymentScreenshot = async (filePath: string): Promise<{ url: string; publicId: string } | null> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'biriyani-orders/payments',
    });
    
    // Clean up local file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    // Attempt cleanup if upload failed
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return null;
  }
};

export const deletePaymentScreenshot = async (publicId: string): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return false;
  }
};
