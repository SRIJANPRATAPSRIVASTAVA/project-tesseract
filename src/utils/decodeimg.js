/**
 * @file decodeBase64Image.js
 * @description This file exports a function to decode a base64-encoded image string.
 */

/**
 * Decodes a base64-encoded image string into a Buffer.
 * 
 * @param {string} base64Str - The base64-encoded image string.
 * @returns {Buffer|null} The decoded image as a Buffer, or null if the input is not a valid base64-encoded image string.
 */
const decodeBase64Image = (base64Str) => {
    // Regular expression to match a base64 image string
    const matches = base64Str.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

    // Check if the input string matches the regular expression
    if (!matches || matches.length !== 3) {
        return null; // Return null if the input string is not a valid base64 image string
    }

    // Convert the base64-encoded string to a Buffer and return it
    return Buffer.from(matches[2], 'base64');
};

module.exports = { decodeBase64Image };
