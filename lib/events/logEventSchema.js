import { z } from "zod";

export const logEventSchema = z.object({
  id: z.string().trim().min(1).optional().nullable(),
  timestamp: z.string().datetime().optional().nullable(),
  level: z.enum(["debug", "info", "success", "warning", "error"]).default("info"),
  area: z.string().trim().min(1),
  source: z.string().trim().min(1),
  phase: z.string().trim().min(1),
  action: z.string().trim().min(1),
  message: z.string().trim().min(1),
  details: z.record(z.string(), z.unknown()).optional().nullable(),
  entity: z
    .object({
      type: z.string().trim().min(1),
      id: z.string().optional().nullable(),
      name: z.string().optional().nullable()
    })
    .optional()
    .nullable(),
  correlationId: z.string().optional().nullable(),
  requestId: z.string().optional().nullable(),
  parentEventId: z.string().optional().nullable()
});
