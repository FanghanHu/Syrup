const path = require("path");

import express from "express";
import apiRoutes from "./api";

const router = express.Router();

// API Routes
router.use("/api", apiRoutes);

// If no API routes are hit, send the React app
router.use(function(req, res) {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

export default router;