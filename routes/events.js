import express from "express";
import { recordEvent, eventsForQuery } from "../lib/index.js";
import { validate, eventsQuery } from "../lib/validation/index.js";

const router = express.Router();

router.get("/", validate({ query: eventsQuery }), (request, response, next) => {
  try {
    response.json(eventsForQuery(request.query));
  } catch (error) {
    next(error);
  }
});

router.post("/", (request, response) => {
  const event = recordEvent({
    ...request.body,
    requestId: request.body?.requestId || request.requestId
  });
  response.status(201).json(event);
});

export default router;
