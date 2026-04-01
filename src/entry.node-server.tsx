/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Node.js server when building for production.
 *
 * Learn more about Node.js server integration here:
 * - https://qwik.dev/docs/deployments/node/
 */
import { createQwikCity } from "@builder.io/qwik-city/middleware/node";
import qwikCityPlan from "@qwik-city-plan";
import render from "./entry.ssr";

const { router, notFound, staticFile } = createQwikCity({
  render,
  qwikCityPlan,
});

export { router, notFound, staticFile };
