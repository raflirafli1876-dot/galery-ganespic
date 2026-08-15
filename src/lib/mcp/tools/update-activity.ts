import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_activity",
  title: "Update activity",
  description:
    "Update an existing activity's title, description, grade level, date, or cover image. Admin only.",
  inputSchema: {
    id: z.string().describe("Activity UUID."),
    title: z.string().optional(),
    description: z.string().optional(),
    grade_level: z.number().int().optional().describe("Grade level 7-12; era is derived from it."),
    activity_date: z.string().optional().describe("Date as YYYY-MM-DD."),
    cover_image_url: z.string().optional().describe("Absolute https URL for the cover photo."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, title, description, grade_level, activity_date, cover_image_url }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const patch: Record<string, unknown> = {};
    if (title !== undefined) patch["title"] = title.trim();
    if (description !== undefined) patch["description"] = description.trim();
    if (activity_date !== undefined) patch["activity_date"] = activity_date;
    if (cover_image_url !== undefined) patch["cover_image_url"] = cover_image_url;
    if (grade_level !== undefined) {
      if (grade_level < 7 || grade_level > 12) {
        return { content: [{ type: "text", text: "grade_level harus 7-12." }], isError: true };
      }
      patch["grade_level"] = grade_level;
      patch["era"] = grade_level <= 9 ? "mts" : "ma";
    }
    if (Object.keys(patch).length === 0) {
      return { content: [{ type: "text", text: "Tidak ada perubahan yang dikirim." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("activities").update(patch).eq("id", id).select().single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { activity: data },
    };
  },
});