import express from "express";
import { contextSources } from "../lib/index.js";

const router = express.Router();

router.get("/context", (_request, response, next) => {
  try {
    response.json(contextSources());
  } catch (error) {
    next(error);
  }
});

export default router;
