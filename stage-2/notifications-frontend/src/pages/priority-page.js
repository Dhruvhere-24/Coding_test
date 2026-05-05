"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Skeleton, Typography } from "@mui/material";
import { AppShell } from "../components/app-shell";
import { NotificationCard } from "../components/notification-card";
import { NotificationFilters } from "../components/notification-filters";
import {
  fetchNotifications,
  getPriorityNotifications,
} from "../lib/notifications";
import { logClientEvent } from "../lib/client-logger";
import { useViewedNotifications } from "../hooks/use-viewed-notifications";

export function PriorityPage() {
  const [notifications, setNotifications] = useState([]);
  const [topN, setTopN] = useState(10);
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
        const data = await fetchNotifications({ page: 1, limit: 100, type });
        if (!active) {
          return;
        }

        setNotifications(data);
        logClientEvent("Loaded priority inbox", {
          type: type || "All",
          sourceCount: data.length,
          topN,
        });
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message);
        logClientEvent("Failed to load priority inbox", {
          type: type || "All",
          topN,
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
  }, [type, topN]);

  const priorityNotifications = getPriorityNotifications(notifications, topN);

  function handleView(id) {
    markViewed(id);
    logClientEvent("Priority notification marked viewed", { id });
  }

  return (
    <AppShell
      title="Priority Inbox"
      subtitle="Focus first on the most important and most recent campus updates."
    >
      <NotificationFilters
        page={1}
        onPageChange={() => {}}
        limit={topN}
        onLimitChange={setTopN}
        type={type}
        onTypeChange={setType}
        showTopN
      />

      {error ? <Alert severity="error">{error}</Alert> : null}

      {!loading && priorityNotifications.length === 0 ? (
        <Typography color="text.secondary">No priority notifications found.</Typography>
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
          : priorityNotifications.map((notification) => (
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
