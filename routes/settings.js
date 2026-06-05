import express from "express";
import { settingsStatus } from "../lib/index.js";

const router = express.Router();

router.get("/status", (_request, response, next) => {
  try {
    response.json(settingsStatus());
  } catch (error) {
    next(error);
  }
});

export default router;
