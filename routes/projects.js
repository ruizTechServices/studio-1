import express from "express";
import { projectList } from "../lib/index.js";

const router = express.Router();

router.get("/", (_request, response, next) => {
  try {
    response.json(projectList());
  } catch (error) {
    next(error);
  }
});

export default router;
