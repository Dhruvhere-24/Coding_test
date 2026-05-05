import fs from "fs";
import path from "path";

const logDirectory = path.join(process.cwd(), "logs");
const logFilePath = path.join(logDirectory, "frontend.log");

export function writeServerLog(level, message, metadata = {}) {
  fs.mkdirSync(logDirectory, { recursive: true });

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    metadata,
  };

  fs.appendFileSync(logFilePath, `${JSON.stringify(entry)}\n`, "utf8");
}
