/**
 * @file validateImageBuffer.js
 * @description This file exports a function to validate if a Buffer contains a valid image using the Sharp library.
 */

const sharp = require("sharp");

/**
 * Validates if a given Buffer contains a valid image.
 * 
 * @param {Buffer} imageBuffer - The Buffer containing image data to validate.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the Buffer contains a valid image, or `false` if it does not.
 */
const validateImageBuffer = async (imageBuffer) => {
    try {
        // Attempt to process the image buffer with Sharp
        await sharp(imageBuffer).toBuffer();
        return true; // Return true if successful
    } catch (error) {
        console.error('Sharp error:', error);
        return false; // Return false if an error occurs
    }
};

module.exports = { validateImageBuffer };
