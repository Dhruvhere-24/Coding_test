"use client";

import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FiberNewIcon from "@mui/icons-material/FiberNew";

const typeColors = {
  Placement: "success",
  Result: "secondary",
  Event: "primary",
};

export function NotificationCard({ notification, isViewed, onView }) {
  return (
    <Card
      onClick={() => onView(notification.id)}
      sx={{
        cursor: "pointer",
        border: isViewed ? "1px solid transparent" : "1px solid",
        borderColor: isViewed ? "transparent" : "secondary.main",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
          <Chip
            label={notification.type}
            color={typeColors[notification.type] || "default"}
            size="small"
          />
          <Chip
            icon={isViewed ? <VisibilityIcon /> : <FiberNewIcon />}
            label={isViewed ? "Viewed" : "New"}
            variant={isViewed ? "outlined" : "filled"}
            size="small"
          />
        </Stack>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {notification.message}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {notification.timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}
