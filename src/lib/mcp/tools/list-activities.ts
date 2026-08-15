import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_activities",
  title: "List activities",
  description:
    "List all Ganespic XXV gallery activities (kegiatan) with grade level, era, date and photo count.",
  inputSchema: {
    era: z.enum(["mts", "ma"]).optional().describe("Filter by era: mts (kelas 7-9) or ma (kelas 10-12)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ era }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("activities")
      .select("id, title, slug, era, grade_level, activity_date, description, cover_image_url, sort_order, activity_photos(id)")
      .order("sort_order", { ascending: true });
    if (era) query = query.eq("era", era);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const items = (data ?? []).map((row: Record<string, unknown>) => {
      const { activity_photos, ...rest } = row;
      return { ...rest, photo_count: (activity_photos as unknown[] | null)?.length ?? 0 };
    });
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { activities: items },
    };
  },
});