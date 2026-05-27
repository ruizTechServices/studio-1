import multer from "multer";
import { recordEventSafely } from "../events/recordEventSafely.js";

export function errorHandler(error, request, response, _next) {
  recordEventSafely({
    level: "error",
    area: "system",
    source: "api",
    phase: "error",
    action: "api_request_failed",
    message: error.message || "Server error",
    details: {
      method: request.method,
      path: request.path
    },
    requestId: request.requestId
  });

  if (error instanceof multer.MulterError) {
    response.status(400).json({ error: error.message });
    return;
  }

  response.status(500).json({ error: error.message || "Server error" });
}
