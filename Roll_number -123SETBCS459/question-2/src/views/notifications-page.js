"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Skeleton, Typography } from "@mui/material";
import { AppShell } from "../components/app-shell";
import { NotificationCard } from "../components/notification-card";
import { NotificationFilters } from "../components/notification-filters";
import { fetchNotifications } from "../lib/notifications";
import { logClientEvent } from "../lib/client-logger";
import { useViewedNotifications } from "../hooks/use-viewed-notifications";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { viewedIds, markViewed } = useViewedNotifications();

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchNotifications({ page, limit, type });
        if (!active) {
          return;
        }

        setNotifications(data);
        logClientEvent("Loaded notifications page", {
          page,
          limit,
          type: type || "All",
          count: data.length,
        });
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message);
        logClientEvent("Failed to load notifications page", {
          page,
          limit,
          type: type || "All",
          errorMessage: loadError.message,
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNotifications();
    return () => {
      active = false;
    };
  }, [page, limit, type]);

  function handleView(id) {
    markViewed(id);
    logClientEvent("Notification marked viewed", { id });
  }

  return (
    <AppShell
      title="All Notifications"
      subtitle="Browse paginated updates and quickly identify which items are new."
    >
      <NotificationFilters
        page={page}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={setLimit}
        type={type}
        onTypeChange={setType}
      />

      {error ? <Alert severity="error">{error}</Alert> : null}

      {!loading && notifications.length === 0 ? (
        <Typography color="text.secondary">No notifications found.</Typography>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Box key={index}>
                <Skeleton variant="rounded" height={140} />
              </Box>
            ))
          : notifications.map((notification) => (
              <Box key={notification.id}>
                <NotificationCard
                  notification={notification}
                  isViewed={viewedIds.includes(notification.id)}
                  onView={handleView}
                />
              </Box>
            ))}
      </Box>
    </AppShell>
  );
}
