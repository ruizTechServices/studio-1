import express from "express";
import { db, projectList } from "../lib/index.js";
import { findProjectIcon } from "../lib/projects/projectIcon.js";

const router = express.Router();

router.get("/", (_request, response, next) => {
  try {
    response.json(projectList());
  } catch (error) {
    next(error);
  }
});

router.get("/:id/icon", (request, response, next) => {
  try {
    const project = db.prepare("SELECT root_path FROM repos WHERE id = ?").get(request.params.id);
    const iconPath = findProjectIcon(project?.root_path);

    if (!iconPath) {
      response.status(404).json({ error: "No .ico image found for this project." });
      return;
    }

    response.type("image/x-icon").sendFile(iconPath);
  } catch (error) {
    next(error);
  }
});

export default router;
