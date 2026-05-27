import { z } from "zod";
import { GITHUB_URL_REGEX } from "../github/assertGitHubUrl.js";

const levelEnum = z.enum(["debug", "info", "success", "warning", "error"]);

export const repoIdParams = z.object({
  id: z.string().trim().min(1)
});

export const deleteRepoBody = z
  .object({
    correlationId: z.string().optional().nullable()
  })
  .passthrough();

export const importGithubBody = z
  .object({
    repoUrl: z.string().trim().regex(GITHUB_URL_REGEX, "Enter a valid GitHub repo URL."),
    correlationId: z.string().optional().nullable()
  })
  .passthrough();

export const entitiesParams = z.object({
  type: z.string().trim().min(1),
  id: z.string().trim().min(1)
});

export const eventsQuery = z
  .object({
    level: levelEnum.optional(),
    area: z.string().optional(),
    source: z.string().optional(),
    entityType: z.string().optional(),
    entityId: z.string().optional(),
    correlationId: z.string().optional(),
    requestId: z.string().optional(),
    limit: z.string().regex(/^\d+$/, "limit must be a positive integer.").optional()
  })
  .passthrough();
