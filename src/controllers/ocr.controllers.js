/**
 * @file ocr.controllers.js
 * @description This file defines the controller functions for handling OCR (Optical Character Recognition) requests.
 */

const { createWorker } = require('tesseract.js');
const { decodeBase64Image } = require("../utils/decodeimg");
const { validateImageBuffer } = require("../utils/validateImageBuffer");

let worker;

/**
 * Initializes the Tesseract.js worker.
 * This function is called to set up the OCR worker before handling requests.
 */
const initWorker = async () => {
    worker = await createWorker('eng');
};
initWorker();

/**
 * Extracts text from a base64-encoded image.
 * 
 * @route POST /api/get-text
 * @param {string} req.body.base64_image - Base64-encoded image string
 * 
 * @returns {Object} JSON response with the extracted text or an error message
 */
const gettext = async (req, res) => {
    const { base64_image } = req.body;
    if (!base64_image) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid base64_image.' },
        });
    }

    const imageBuffer = decodeBase64Image(base64_image);
    if (!imageBuffer) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid base64_image.' },
        });
    }

    if (!await validateImageBuffer(imageBuffer)) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid base64_image.' },
        });
    }

    try {
        const { data: { text } } = await worker.recognize(imageBuffer);
        res.json({ success: true, result: { text } });
    } catch (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
    }
};

/**
 * Extracts bounding boxes of a specific type from a base64-encoded image.
 * 
 * @route POST /api/get-bboxes
 * @param {string} req.body.base64_image - Base64-encoded image string
 * @param {string} req.body.bbox_type - Type of bounding boxes to extract (one of: "word", "line", "paragraph", "block", "page")
 * 
 * @returns {Object} JSON response with the extracted bounding boxes or an error message
 */
const getboxes = async (req, res) => {
    const { base64_image, bbox_type } = req.body;
    if (!base64_image || !bbox_type) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid base64_image or bbox_type.' },
        });
    }

    const validTypes = ["word", "line", "paragraph", "block", "page"];
    if (!validTypes.includes(bbox_type)) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid bbox_type.' },
        });
    }

    const imageBuffer = decodeBase64Image(base64_image);
    if (!imageBuffer) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid base64_image.' },
        });
    }

    if (!await validateImageBuffer(imageBuffer)) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid base64_image.' },
        });
    }

    try {
        const { data } = await worker.recognize(imageBuffer);
        let bboxes = [];

        switch (bbox_type) {
            case 'word':
                bboxes = data.words.map(word => ({
                    x_min: word.bbox.x0,
                    y_min: word.bbox.y0,
                    x_max: word.bbox.x1,
                    y_max: word.bbox.y1
                }));
                break;
            case 'line':
                bboxes = data.lines.map(line => ({
                    x_min: line.bbox.x0,
                    y_min: line.bbox.y0,
                    x_max: line.bbox.x1,
                    y_max: line.bbox.y1
                }));
                break;
            case 'paragraph':
                bboxes = data.paragraphs.map(paragraph => ({
                    x_min: paragraph.bbox.x0,
                    y_min: paragraph.bbox.y0,
                    x_max: paragraph.bbox.x1,
                    y_max: paragraph.bbox.y1
                }));
                break;
            case 'block':
                bboxes = data.blocks.map(block => ({
                    x_min: block.bbox.x0,
                    y_min: block.bbox.y0,
                    x_max: block.bbox.x1,
                    y_max: block.bbox.y1
                }));
                break;
            case 'page':
                bboxes = data.pages.map(page => ({
                    x_min: page.bbox.x0,
                    y_min: page.bbox.y0,
                    x_max: page.bbox.x1,
                    y_max: page.bbox.y1
                }));
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: { message: 'Invalid bbox_type.' },
                });
        }

        res.json({ success: true, result: { bboxes } });
    } catch (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
    }
};

// Terminate the worker when the process exits
process.on('exit', async () => {
    await worker.terminate();
});

module.exports = { getboxes, gettext };
