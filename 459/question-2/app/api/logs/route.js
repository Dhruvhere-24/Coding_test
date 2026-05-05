import { writeServerLog } from "../../../src/server/logger";

export async function POST(request) {
  const payload = await request.json();

  writeServerLog("INFO", payload.message || "Client event", {
    source: "client",
    ...payload.metadata,
  });

  return Response.json({ ok: true });
}
