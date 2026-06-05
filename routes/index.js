// Combines the resource routers under a single /api router.
import express from "express";
import reposRouter from "./repos.js";
import eventsRouter from "./events.js";
import entitiesRouter from "./entities.js";
import metaRouter from "./meta.js";
import projectsRouter from "./projects.js";
import specsRouter from "./specs.js";
import agentsRouter from "./agents.js";
import workflowsRouter from "./workflows.js";
import memoryRouter from "./memory.js";
import settingsRouter from "./settings.js";

const router = express.Router();

router.use("/repos", reposRouter);
router.use("/events", eventsRouter);
router.use("/entities", entitiesRouter);
router.use("/projects", projectsRouter);
router.use("/specs", specsRouter);
router.use("/agents", agentsRouter);
router.use("/workflows", workflowsRouter);
router.use("/memory", memoryRouter);
router.use("/settings", settingsRouter);
router.use("/", metaRouter);

export default router;
