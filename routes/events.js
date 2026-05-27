import express from "express";
import { recordEvent, eventsForQuery } from "../lib/index.js";

const router = express.Router();

router.get("/", (request, response, next) => {
  try {
    response.json(eventsForQuery(request.query));
  } catch (error) {
    next(error);
  }
});

router.post("/", (request, response, _next) => {
  try {
    const event = recordEvent({
      ...request.body,
      requestId: request.body?.requestId || request.requestId
    });
    response.status(201).json(event);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

export default router;
