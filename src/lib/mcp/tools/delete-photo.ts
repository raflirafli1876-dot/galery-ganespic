import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "delete_photo",
  title: "Delete photo",
  description: "Permanently remove a photo from an activity by its photo id. Admin only.",
  inputSchema: { photo_id: z.string().describe("Photo UUID to delete.") },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ photo_id }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase.from("activity_photos").delete().eq("id", photo_id);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Foto ${photo_id} dihapus.` }] };
  },
});