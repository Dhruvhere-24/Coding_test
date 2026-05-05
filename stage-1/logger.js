const fs = require("fs");
const path = require("path");

class AssessmentLogger {
  constructor(options = {}) {
    this.logDirectory = options.logDirectory || path.join(__dirname, "logs");
    this.logFileName = options.logFileName || "assessment.log";
    this.logFilePath = path.join(this.logDirectory, this.logFileName);
    fs.mkdirSync(this.logDirectory, { recursive: true });
  }

  write(level, message, metadata = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    };

    fs.appendFileSync(this.logFilePath, `${JSON.stringify(entry)}\n`, "utf8");
  }

  info(message, metadata = {}) {
    this.write("INFO", message, metadata);
  }

  warn(message, metadata = {}) {
    this.write("WARN", message, metadata);
  }

  error(message, metadata = {}) {
    this.write("ERROR", message, metadata);
  }
}

module.exports = {
  AssessmentLogger,
};
