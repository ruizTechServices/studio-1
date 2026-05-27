import express from "express";
import { eventsForQuery } from "../lib/index.js";

const router = express.Router();

router.get("/:type/:id/events", (request, response, next) => {
  try {
    response.json(eventsForQuery({
      ...request.query,
      entityType: request.params.type,
      entityId: request.params.id
    }));
  } catch (error) {
    next(error);
  }
});

export default router;
