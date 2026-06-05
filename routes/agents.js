import express from "express";
import { agentEvidence } from "../lib/index.js";

const router = express.Router();

router.get("/", (_request, response, next) => {
  try {
    response.json(agentEvidence());
  } catch (error) {
    next(error);
  }
});

export default router;
