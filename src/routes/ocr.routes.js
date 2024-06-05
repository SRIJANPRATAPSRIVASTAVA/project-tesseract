/**
 * @file ocr.routes.js
 * @description This file defines the routes for OCR (Optical Character Recognition) related endpoints.
 */

const { Router } = require("express");
const { gettext, getboxes } = require("../controllers/ocr.controllers");
const ocrRouter = Router();

/**
 * @route POST /api/get-text
 * @description Extracts text from an image provided in the request body.
 * @access Public
 */
ocrRouter.post('/get-text', gettext);

/**
 * @route POST /api/get-bboxes
 * @description Extracts bounding boxes of a specific type from an image provided in the request body.
 * @access Public
 */
ocrRouter.post('/get-bboxes', getboxes);

module.exports = ocrRouter;
