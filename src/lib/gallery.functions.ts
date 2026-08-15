import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { fetchPublicActivities, fetchPublicActivityBySlug } from "./gallery-public.server";

export const listPublicActivities = createServerFn({ method: "GET" }).handler(async () =>
  fetchPublicActivities(),
);

export const getPublicActivityBySlug = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => fetchPublicActivityBySlug(data.slug));