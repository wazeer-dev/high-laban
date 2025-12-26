const API_KEY = '2d78cb0a82dc30eedac7158c574fdafb';

/**
 * Uploads a base64 image string to ImgBB.
 * @param {string} base64Image - The base64 string of the image (can include data URI scheme).
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export const uploadImage = async (base64Image) => {
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") to get just the base64 data
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const formData = new FormData();
    formData.append('image', cleanBase64);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            return data.data.url;
        } else {
            throw new Error(data.error?.message || 'Upload failed');
        }
    } catch (error) {
        console.error('ImgBB Upload Error:', error);
        throw error;
    }
};
