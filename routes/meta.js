import express from "express";
import { ignoredDirs, allowedExtensions, MAX_FILE_SIZE_BYTES } from "../lib/index.js";

const router = express.Router();

router.get("/filter-rules", (_request, response) => {
  response.json({
    ignoredDirs: Array.from(ignoredDirs),
    allowedExtensions: Array.from(allowedExtensions),
    maxFileSizeBytes: MAX_FILE_SIZE_BYTES
  });
});

export default router;
