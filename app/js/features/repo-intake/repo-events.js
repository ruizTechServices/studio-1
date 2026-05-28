import { repoState } from "./repo-state.js";
import { persistActionEvent } from "./repo-api.js";

let _onEventsUpdated = () => {};

export function setEventsUpdatedCallback(fn) {
  _onEventsUpdated = fn;
}

export function createClientId(prefix) {
  if (window.crypto?.randomUUID) {
    return `${prefix}_${Date.now()}_${window.crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

export function normalizeActionEvent(input = {}) {
  return {
    id: input.id || createClientId("evt"),
    timestamp: input.timestamp || new Date().toISOString(),
    level: input.level || "info",
    area: input.area || "system",
    source: input.source || "ui",
    phase: input.phase || "input",
    action: input.action || "event_recorded",
    message: input.message || "Event recorded.",
    details: input.details || null,
    entity: input.entity || null,
    correlationId: input.correlationId || null,
    requestId: input.requestId || null,
    parentEventId: input.parentEventId || null
  };
}

export function sortActionEvents(events) {
  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function upsertActionEvent(event) {
  repoState.actionEvents = sortActionEvents([
    event,
    ...repoState.actionEvents.filter((item) => item.id !== event.id)
  ]).slice(0, 150);
  _onEventsUpdated();
}

export function mergeActionEvents(events) {
  const byId = new Map(repoState.actionEvents.map((event) => [event.id, event]));
  events.forEach((event) => byId.set(event.id, normalizeActionEvent(event)));
  repoState.actionEvents = sortActionEvents(Array.from(byId.values())).slice(0, 150);
  _onEventsUpdated();
}

export function logEvent(input, options = {}) {
  const event = normalizeActionEvent(input);
  upsertActionEvent(event);

  if (options.persist === false) {
    return event;
  }

  persistActionEvent(event)
    .then((savedEvent) => upsertActionEvent(normalizeActionEvent(savedEvent)))
    .catch(() => {});

  return event;
}
