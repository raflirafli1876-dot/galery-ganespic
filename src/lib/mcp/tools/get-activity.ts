import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_activity",
  title: "Get activity",
  description: "Get one activity by slug or id, including its full description and all photos.",
  inputSchema: {
    slug: z.string().optional().describe("Activity slug, e.g. 'matsama-kelas-7'."),
    id: z.string().optional().describe("Activity UUID. Used when slug is omitted."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug, id }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    if (!slug && !id) {
      return { content: [{ type: "text", text: "Sertakan slug atau id." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const query = supabase
      .from("activities")
      .select("id, title, slug, description, era, grade_level, activity_date, cover_image_url, sort_order, activity_photos(id, image_url, caption, sort_order)");
    const { data, error } = await (slug ? query.eq("slug", slug) : query.eq("id", id!)).maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Kegiatan tidak ditemukan." }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { activity: data },
    };
  },
});