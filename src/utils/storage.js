import { storage, isConfigured } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { uploadImage as uploadToImgBB } from './imgbb'; // Keep as fallback/helper

/**
 * Uploads a file (Image or Video) to Cloud Storage.
 * Strategy:
 * 1. If Firebase is Configured -> Use Firebase Storage (Supports all files).
 * 2. If NOT Configured -> Use ImgBB (Images only).
 * 3. If Video & No Firebase -> Error "Video requires Cloud Config".
 * 
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} - The download URL
 */
export const uploadMedia = async (file) => {
    const isVideo = file.type.startsWith('video/');

    if (isConfigured()) {
        try {
            // Create a unique filename: timestamp_filename
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `uploads/${fileName}`);

            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error("Firebase Storage Error:", error);
            throw new Error("Failed to upload to Cloud Storage.");
        }
    } else {
        // Fallback Logic
        if (isVideo) {
            alert("⚠️ Setup Required: To upload VIDEOS, you must add your Firebase Config in src/utils/firebase.js");
            throw new Error("Video upload requires Firebase Storage.");
        }

        // For images, we can try ImgBB or just Base64 (but Base64 is heavy)
        // Let's use the helper we already have logic for (Base64 -> ImgBB)
        // But ImgBB needs Base64 string input usually? 
        // Our existing uploadToImgBB takes Base64 string.

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                try {
                    const url = await uploadToImgBB(reader.result);
                    resolve(url);
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = reject;
        });
    }
};
