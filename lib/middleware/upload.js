import multer from "multer";
import { tempDir } from "../paths.js";
import { MAX_FILE_SIZE_BYTES } from "../config.js";

export const upload = multer({
  dest: tempDir,
  preservePath: true,
  limits: {
    files: 3000,
    fileSize: MAX_FILE_SIZE_BYTES
  }
});
