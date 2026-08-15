import { auth, defineMcp } from "@lovable.dev/mcp-js";

import listActivities from "./tools/list-activities";
import getActivity from "./tools/get-activity";
import createActivity from "./tools/create-activity";
import updateActivity from "./tools/update-activity";
import addPhoto from "./tools/add-photo";
import deletePhoto from "./tools/delete-photo";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "ganespic-xxv-gallery",
  title: "Ganespic XXV Gallery",
  version: "0.1.0",
  instructions:
    "Tools for the Ganespic XXV class gallery archive. Browse activities (kegiatan) from kelas 7 MTs to kelas 12 MA, read their descriptions and photos, and — for archive admins — create or edit activities and manage their photos.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listActivities,
    getActivity,
    createActivity,
    updateActivity,
    addPhoto,
    deletePhoto,
  ] as unknown as never[],
});