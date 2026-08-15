import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, slugify, supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_activity",
  title: "Create activity",
  description:
    "Create a new gallery activity (kegiatan). Requires the connected user to be an archive admin.",
  inputSchema: {
    title: z.string().describe("Activity title in Indonesian, e.g. 'Class Meeting Kelas 8'."),
    grade_level: z.number().int().describe("Grade level from 7 to 12."),
    description: z.string().optional().describe("Narrative description of the activity."),
    activity_date: z.string().optional().describe("Date as YYYY-MM-DD."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ title, grade_level, description, activity_date }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    if (grade_level < 7 || grade_level > 12) {
      return { content: [{ type: "text", text: "grade_level harus 7-12." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const era = grade_level <= 9 ? "mts" : "ma";
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    const { data, error } = await supabase
      .from("activities")
      .insert({
        title: title.trim(),
        slug,
        era,
        grade_level,
        description: description?.trim() ?? "",
        activity_date: activity_date ?? null,
        sort_order: grade_level * 100,
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { activity: data },
    };
  },
});