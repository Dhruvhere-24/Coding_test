# Stage 2 Frontend

This is a Next.js + Material UI frontend for the campus notifications assessment.

## Features

- All notifications page with pagination and type filter
- Priority inbox page with top `n` selection and type filter
- visual distinction between new and viewed notifications
- protected API access through a server-side proxy route
- file-based logging for server events and client interaction events

## Run

Install dependencies and start:

```powershell
npm.cmd install
$env:AUTH_TOKEN="your-token"
npm.cmd run dev
```

The app runs on:

```text
http://localhost:3000
```

Optional environment variables:

```powershell
$env:NOTIFICATIONS_API_URL="http://20.207.122.201/evaluation-service/notifications"
$env:AUTH_SCHEME="Bearer"
```
