import express from "express";
import { workflowRuns } from "../lib/index.js";

const router = express.Router();

router.get("/runs", (_request, response, next) => {
  try {
    response.json(workflowRuns());
  } catch (error) {
    next(error);
  }
});

export default router;
