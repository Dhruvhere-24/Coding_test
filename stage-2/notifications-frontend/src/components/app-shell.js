"use client";

import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

export function AppShell({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(224,247,250,1) 0%, rgba(244,248,251,1) 35%, rgba(255,255,255,1) 100%)",
      }}
    >
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Typography variant="h6" color="primary.main">
            Campus Notifications
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button component={Link} href="/" variant="text">
              All Notifications
            </Button>
            <Button component={Link} href="/priority" variant="contained">
              Priority Inbox
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 5 }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h3" color="primary.main">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        </Stack>
        {children}
      </Container>
    </Box>
  );
}
