const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function normalizeNotification(notification, index) {
  return {
    id:
      notification.id ||
      notification.ID ||
      notification.IO ||
      notification.Id ||
      `notification-${index + 1}`,
    type: notification.type || notification.Type || "Event",
    message: notification.message || notification.Message || "",
    timestamp: notification.timestamp || notification.Timestamp || "",
  };
}

export function normalizeNotifications(notifications = []) {
  return notifications.map(normalizeNotification);
}

export function getNotificationWeight(type) {
  return TYPE_WEIGHTS[type] || 0;
}

export function getPriorityNotifications(notifications, limit) {
  return [...notifications]
    .sort((left, right) => {
      const weightDelta =
        getNotificationWeight(right.type) - getNotificationWeight(left.type);
      if (weightDelta !== 0) {
        return weightDelta;
      }

      const timeDelta =
        new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime();
      if (timeDelta !== 0) {
        return timeDelta;
      }

      return String(left.id).localeCompare(String(right.id));
    })
    .slice(0, limit);
}

export async function fetchNotifications({ page = 1, limit = 10, type = "" } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (type) {
    params.set("notification_type", type);
  }

  const response = await fetch(`/api/notifications?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Failed to fetch notifications");
  }

  const payload = await response.json();
  return normalizeNotifications(payload.notifications || []);
}
