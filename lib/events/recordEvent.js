import { db } from "../db.js";
import { normalizeLogEvent } from "./normalizeLogEvent.js";

export function recordEvent(input) {
  const event = normalizeLogEvent(input);
  db.prepare(`
    INSERT INTO action_events (
      id,
      timestamp,
      level,
      area,
      source,
      phase,
      action,
      message,
      details_json,
      entity_type,
      entity_id,
      entity_name,
      correlation_id,
      request_id,
      parent_event_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `).run(
    event.id,
    event.timestamp,
    event.level,
    event.area,
    event.source,
    event.phase,
    event.action,
    event.message,
    event.details ? JSON.stringify(event.details) : null,
    event.entity?.type || null,
    event.entity?.id || null,
    event.entity?.name || null,
    event.correlationId,
    event.requestId,
    event.parentEventId
  );
  return event;
}
