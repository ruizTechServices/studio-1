import { recordEvent } from "./recordEvent.js";

export function recordEventSafely(input) {
  try {
    return recordEvent(input);
  } catch (error) {
    console.error("Failed to record action event:", error.message);
    return null;
  }
}
