const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

// Log Cloudinary configuration (without exposing secrets)
console.log('Cloudinary Configuration:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');

// Configure Cloudinary with explicit values to avoid undefined
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Cloudinary configuration is incomplete. Please check your .env file.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// Promisify the cloudinary uploader
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    // Verify Cloudinary configuration before attempting upload
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return reject(new Error('Cloudinary configuration is missing. Check your environment variables.'));
    }
    
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error details:', error);
            return reject(error);
          }
          resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    } catch (error) {
      console.error('Error creating upload stream:', error);
      reject(error);
    }
  });
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  console.log('Attempting to delete from Cloudinary with public ID:', publicId);
  
  if (!publicId) {
    console.log('No public ID provided, skipping deletion');
    return null;
  }
  
  try {
    console.log('Calling Cloudinary API to delete image with public ID:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete API response:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return null;
  }
};

// Extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  console.log('Extracting public ID from URL:', url);
  
  if (!url || !url.includes('cloudinary.com')) {
    console.log('Not a Cloudinary URL, returning null');
    return null;
  }
  
  try {
    // Extract the public_id from the URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
    const urlParts = url.split('/');
    console.log('URL parts:', urlParts);
    
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    console.log('File name with extension:', fileNameWithExtension);
    
    const fileName = fileNameWithExtension.split('.')[0];
    console.log('File name without extension:', fileName);
    
    // Check for version number in URL (v1234567890)
    const versionRegex = /^v\d+$/;
    const hasVersionNumber = urlParts.some(part => versionRegex.test(part));
    console.log('Has version number in URL:', hasVersionNumber);
    
    // Find the upload part in the URL
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    console.log('Upload index:', uploadIndex);
    
    if (uploadIndex === -1) {
      console.log('Could not find "upload" in URL parts');
      return null;
    }
    
    // Skip the version number if present
    let startIndex = uploadIndex + 1;
    if (hasVersionNumber && versionRegex.test(urlParts[startIndex])) {
      console.log('Skipping version number:', urlParts[startIndex]);
      startIndex++;
    }
    
    // Extract folder path and file name
    if (startIndex >= urlParts.length - 1) {
      console.log('No folder structure detected');
      return fileName;
    }
    
    // Get everything between upload/version and the filename
    const folderPath = urlParts.slice(startIndex, urlParts.length - 1).join('/');
    console.log('Folder path:', folderPath);
    
    // Construct the final public ID
    const publicId = folderPath ? `${folderPath}/${fileName}` : fileName;
    console.log('Final public ID:', publicId);
    
    // For blog_images folder, make sure it's included
    if (folderPath.includes('blog_images')) {
      return publicId;
    } else if (publicId.startsWith('blog_images/')) {
      return publicId;
    } else {
      // If the folder is not already included, add it
      const finalPublicId = `blog_images/${publicId}`;
      console.log('Adding blog_images folder. Final public ID:', finalPublicId);
      return finalPublicId;
    }
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

// Test Cloudinary configuration
const testCloudinaryConfig = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection test successful:', result);
    return true;
  } catch (error) {
    console.error('Cloudinary connection test failed:', error);
    return false;
  }
};

// Run the test when this module is loaded
testCloudinaryConfig();

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
  testCloudinaryConfig
};