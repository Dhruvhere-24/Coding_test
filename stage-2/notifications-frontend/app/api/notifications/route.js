import { NextResponse } from "next/server";
import { writeServerLog } from "../../../src/server/logger";

const BASE_URL =
  process.env.NOTIFICATIONS_API_URL ||
  "http://20.207.122.201/evaluation-service/notifications";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const upstreamParams = new URLSearchParams();

  ["limit", "page", "notification_type"].forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      upstreamParams.set(key, value);
    }
  });

  const targetUrl = upstreamParams.toString()
    ? `${BASE_URL}?${upstreamParams.toString()}`
    : BASE_URL;

  const headers = {
    Accept: "application/json",
  };

  const authToken = process.env.AUTH_TOKEN;
  if (authToken) {
    headers.Authorization = `${process.env.AUTH_SCHEME || "Bearer"} ${authToken}`;
  }

  writeServerLog("INFO", "Proxying notifications request", {
    targetUrl,
    authConfigured: Boolean(authToken),
  });

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      writeServerLog("ERROR", "Upstream notifications request failed", {
        status: response.status,
      });

      return NextResponse.json(
        { message: `Upstream request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    writeServerLog("ERROR", "Notifications proxy crashed", {
      errorMessage: error.message,
    });

    return NextResponse.json(
      { message: "Unable to load notifications right now." },
      { status: 500 }
    );
  }
}
