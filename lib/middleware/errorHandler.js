import { z } from "zod";
import multer from "multer";
import { recordEventSafely } from "../events/recordEventSafely.js";

function statusFor(error) {
  if (error instanceof z.ZodError) {
    return 400;
  }
  if (error instanceof multer.MulterError) {
    return 400;
  }
  const code = Number(error?.statusCode ?? error?.status);
  return Number.isInteger(code) && code >= 400 && code < 500 ? code : 500;
}

function clientMessage(error, status) {
  if (status >= 500) {
    return "Server error";
  }
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => `${issue.path.join(".") || "request"}: ${issue.message}`).join("; ");
  }
  return error.message || "Request error";
}

export function errorHandler(error, request, response, _next) {
  const status = statusFor(error);

  recordEventSafely({
    level: "error",
    area: "system",
    source: "api",
    phase: "error",
    action: "api_request_failed",
    message: error?.message || "Server error",
    details: {
      method: request.method,
      path: request.path,
      statusCode: status,
      ...(error instanceof z.ZodError ? { issues: error.issues } : {}),
      ...(status >= 500 && error?.stack ? { stack: error.stack } : {})
    },
    requestId: request.requestId
  });

  response.status(status).json({
    error: clientMessage(error, status),
    requestId: request.requestId
  });
}
