const fs = require("fs");
const path = require("path");
const { AssessmentLogger } = require("./logger");

const DEFAULT_API_URL =
  process.env.NOTIFICATIONS_API_URL ||
  "http://20.207.122.201/evaluation-service/notifications";
const DEFAULT_TOP_N = Number.parseInt(process.env.TOP_N || "10", 10);
const OUTPUT_DIRECTORY = path.join(__dirname, "output");
const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const logger = new AssessmentLogger();

class MinHeap {
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  size() {
    return this.items.length;
  }

  peek() {
    return this.items[0] || null;
  }

  push(value) {
    this.items.push(value);
    this.bubbleUp(this.items.length - 1);
  }

  replaceTop(value) {
    this.items[0] = value;
    this.bubbleDown(0);
  }

  toArray() {
    return [...this.items];
  }

  bubbleUp(index) {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (this.compare(this.items[currentIndex], this.items[parentIndex]) >= 0) {
        break;
      }

      [this.items[currentIndex], this.items[parentIndex]] = [
        this.items[parentIndex],
        this.items[currentIndex],
      ];
      currentIndex = parentIndex;
    }
  }

  bubbleDown(index) {
    let currentIndex = index;
    const lastIndex = this.items.length - 1;

    while (true) {
      const leftChildIndex = currentIndex * 2 + 1;
      const rightChildIndex = currentIndex * 2 + 2;
      let smallestIndex = currentIndex;

      if (
        leftChildIndex <= lastIndex &&
        this.compare(this.items[leftChildIndex], this.items[smallestIndex]) < 0
      ) {
        smallestIndex = leftChildIndex;
      }

      if (
        rightChildIndex <= lastIndex &&
        this.compare(this.items[rightChildIndex], this.items[smallestIndex]) < 0
      ) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === currentIndex) {
        break;
      }

      [this.items[currentIndex], this.items[smallestIndex]] = [
        this.items[smallestIndex],
        this.items[currentIndex],
      ];
      currentIndex = smallestIndex;
    }
  }
}

class TopNotificationsTracker {
  constructor(limit) {
    this.limit = limit;
    this.heap = new MinHeap(compareNotificationsAscending);
  }

  add(notification) {
    if (this.heap.size() < this.limit) {
      this.heap.push(notification);
      return;
    }

    const smallestInTop = this.heap.peek();
    if (compareNotificationsAscending(notification, smallestInTop) > 0) {
      this.heap.replaceTop(notification);
    }
  }

  getTopNotifications() {
    return this.heap
      .toArray()
      .sort((left, right) => compareNotificationsAscending(right, left));
  }
}

function compareNotificationsAscending(left, right) {
  if (left.weight !== right.weight) {
    return left.weight - right.weight;
  }

  if (left.timestampMs !== right.timestampMs) {
    return left.timestampMs - right.timestampMs;
  }

  return String(left.id).localeCompare(String(right.id));
}

function normalizeNotification(notification, index) {
  const id =
    notification.id ||
    notification.ID ||
    notification.IO ||
    notification.Id ||
    `notification-${index + 1}`;
  const type = notification.type || notification.Type || "Event";
  const message = notification.message || notification.Message || "";
  const timestamp = notification.timestamp || notification.Timestamp;
  const timestampMs = new Date(timestamp).getTime();

  if (!Number.isFinite(timestampMs)) {
    throw new Error(`Invalid timestamp for notification ${id}`);
  }

  const weight = TYPE_WEIGHTS[type] || 0;

  return {
    id,
    type,
    message,
    timestamp,
    timestampMs,
    weight,
  };
}

async function fetchNotifications() {
  const headers = {
    Accept: "application/json",
  };

  const authToken = process.env.AUTH_TOKEN;
  const authScheme = process.env.AUTH_SCHEME || "Bearer";
  if (authToken) {
    headers.Authorization = `${authScheme} ${authToken}`;
  }

  logger.info("Fetching notifications from API", {
    url: DEFAULT_API_URL,
    authConfigured: Boolean(authToken),
  });

  const response = await fetch(DEFAULT_API_URL, { headers });
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.notifications)) {
    throw new Error("API response does not contain a notifications array");
  }

  return payload.notifications;
}

function ensureOutputDirectory() {
  fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
}

function writeOutputs(topNotifications) {
  ensureOutputDirectory();

  const jsonPath = path.join(OUTPUT_DIRECTORY, "top-10-notifications.json");
  const textPath = path.join(OUTPUT_DIRECTORY, "top-10-notifications.txt");

  const jsonPayload = topNotifications.map((notification, index) => ({
    rank: index + 1,
    id: notification.id,
    type: notification.type,
    message: notification.message,
    timestamp: notification.timestamp,
    weight: notification.weight,
  }));

  const textPayload = topNotifications
    .map(
      (notification, index) =>
        `${index + 1}. [${notification.type}] ${notification.message} | ${notification.timestamp} | weight=${notification.weight} | id=${notification.id}`
    )
    .join("\n");

  fs.writeFileSync(jsonPath, `${JSON.stringify(jsonPayload, null, 2)}\n`, "utf8");
  fs.writeFileSync(textPath, `${textPayload}\n`, "utf8");

  logger.info("Wrote ranked outputs", {
    jsonPath,
    textPath,
    count: topNotifications.length,
  });
}

function rankNotifications(notifications, limit) {
  const tracker = new TopNotificationsTracker(limit);

  notifications.forEach((notification, index) => {
    const normalized = normalizeNotification(notification, index);
    tracker.add(normalized);
  });

  return tracker.getTopNotifications();
}

async function main() {
  logger.info("Priority inbox ranking started", { topN: DEFAULT_TOP_N });

  const notifications = await fetchNotifications();
  logger.info("Fetched notifications successfully", {
    count: notifications.length,
  });

  const topNotifications = rankNotifications(notifications, DEFAULT_TOP_N);
  writeOutputs(topNotifications);

  process.stdout.write("Top priority notifications:\n");
  topNotifications.forEach((notification, index) => {
    process.stdout.write(
      `${index + 1}. [${notification.type}] ${notification.message} | ${notification.timestamp} | id=${notification.id}\n`
    );
  });

  logger.info("Priority inbox ranking completed", {
    returnedCount: topNotifications.length,
  });
}

main().catch((error) => {
  logger.error("Priority inbox ranking failed", {
    errorMessage: error.message,
  });
  process.stderr.write(`Error: ${error.message}\n`);
  process.exitCode = 1;
});
