import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "add_photo",
  title: "Add photo to activity",
  description:
    "Attach a photo to an activity using an absolute image URL (cloud link or CDN). Admin only.",
  inputSchema: {
    activity_id: z.string().describe("Activity UUID the photo belongs to."),
    image_url: z.string().describe("Absolute https URL of the image."),
    caption: z.string().optional().describe("Short Indonesian caption."),
    make_cover: z.boolean().optional().describe("Also set this photo as the activity cover."),
  },
  annotations: { readOnlyHint: false, openWorldHint: false },
  handler: async ({ activity_id, image_url, caption, make_cover }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    if (!/^https:\/\//i.test(image_url)) {
      return { content: [{ type: "text", text: "image_url harus URL https absolut." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { count } = await supabase
      .from("activity_photos")
      .select("id", { count: "exact", head: true })
      .eq("activity_id", activity_id);
    const { data, error } = await supabase
      .from("activity_photos")
      .insert({
        activity_id,
        image_url,
        caption: caption?.trim() ?? "",
        sort_order: (count ?? 0) + 1,
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (make_cover) {
      const { error: coverError } = await supabase
        .from("activities")
        .update({ cover_image_url: image_url })
        .eq("id", activity_id);
      if (coverError) {
        return { content: [{ type: "text", text: `Foto ditambahkan, gagal set sampul: ${coverError.message}` }] };
      }
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { photo: data },
    };
  },
});