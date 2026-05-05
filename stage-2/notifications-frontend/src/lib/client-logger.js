export async function logClientEvent(message, metadata = {}) {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, metadata }),
    });
  } catch (_error) {
    // Logging failures should never break the UI.
  }
}
