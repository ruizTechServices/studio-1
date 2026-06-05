import express from "express";
import { specCandidates } from "../lib/index.js";

const router = express.Router();

router.get("/", (_request, response, next) => {
  try {
    response.json(specCandidates());
  } catch (error) {
    next(error);
  }
});

export default router;
