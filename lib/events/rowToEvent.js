export function rowToEvent(row) {
  return {
    id: row.id,
    timestamp: row.timestamp,
    level: row.level,
    area: row.area,
    source: row.source,
    phase: row.phase,
    action: row.action,
    message: row.message,
    details: row.details_json ? JSON.parse(row.details_json) : null,
    entity: row.entity_type
      ? {
          type: row.entity_type,
          id: row.entity_id,
          name: row.entity_name
        }
      : null,
    correlationId: row.correlation_id,
    requestId: row.request_id,
    parentEventId: row.parent_event_id
  };
}
