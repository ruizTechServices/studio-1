import { loadHtmlPartials } from "./core/html-loader.js";

await loadHtmlPartials();

await import("../script.js");