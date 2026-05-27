import { db } from "../db.js";
import { rowToEvent } from "./rowToEvent.js";

export function eventsForQuery(query) {
  const clauses = [];
  const values = [];
  const filterMap = {
    level: "level",
    area: "area",
    source: "source",
    entityType: "entity_type",
    entityId: "entity_id",
    correlationId: "correlation_id",
    requestId: "request_id"
  };

  for (const [queryKey, column] of Object.entries(filterMap)) {
    if (query[queryKey]) {
      clauses.push(`${column} = ?`);
      values.push(String(query[queryKey]));
    }
  }

  const requestedLimit = Number.parseInt(query.limit, 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 500) : 100;
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(`SELECT * FROM action_events ${where} ORDER BY timestamp DESC LIMIT ?`)
    .all(...values, limit)
    .map(rowToEvent);
}
