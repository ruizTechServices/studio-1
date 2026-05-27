import { logEventSchema } from "./logEventSchema.js";
import { createId } from "../ids/createId.js";
import { normalizeNullableString } from "../ids/normalizeNullableString.js";

export function normalizeLogEvent(input = {}) {
  const parsed = logEventSchema.parse(input);
  const event = {
    id: normalizeNullableString(parsed.id) || createId("evt"),
    timestamp: normalizeNullableString(parsed.timestamp) || new Date().toISOString(),
    level: parsed.level,
    area: parsed.area,
    source: parsed.source,
    phase: parsed.phase,
    action: parsed.action,
    message: parsed.message,
    details: parsed.details || null,
    entity: parsed.entity
      ? {
          type: normalizeNullableString(parsed.entity.type),
          id: normalizeNullableString(parsed.entity.id),
          name: normalizeNullableString(parsed.entity.name)
        }
      : null,
    correlationId: normalizeNullableString(parsed.correlationId),
    requestId: normalizeNullableString(parsed.requestId),
    parentEventId: normalizeNullableString(parsed.parentEventId)
  };

  return event;
}
