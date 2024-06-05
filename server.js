/**
 * @file server.js
 * @description This file sets up and runs an Express server that provides OCR (Optical Character Recognition) services.
 */

const express = require('express');
const ocrRouter = require('./src/routes/ocr.routes');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies with a limit of 10MB
app.use(express.json({ limit: '10mb' }));

// Middleware to set the response Content-Type header to 'application/json' for all routes
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

/**
 * @description Use the OCR router for handling routes under the '/api' path.
 * The OCR router provides endpoints for extracting text and bounding boxes from images.
 */
app.use('/api', ocrRouter);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
