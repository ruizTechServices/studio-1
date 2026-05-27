// Combines the resource routers under a single /api router.
import express from "express";
import reposRouter from "./repos.js";
import eventsRouter from "./events.js";
import entitiesRouter from "./entities.js";
import metaRouter from "./meta.js";

const router = express.Router();

router.use("/repos", reposRouter);
router.use("/events", eventsRouter);
router.use("/entities", entitiesRouter);
router.use("/", metaRouter);

export default router;
