# Stage 1

This folder contains the Stage 1 solution for ranking the top priority notifications.

## Files

- `priority-inbox.js`: fetches notifications, ranks the top 10, and writes outputs
- `logger.js`: custom logging middleware used by the script
- `Notification_System_Design.md`: explanation of the approach and data structure

## Run

```powershell
$env:AUTH_TOKEN="your-token"
node .\stage-1\priority-inbox.js
```

Generated output:

- `output/top-10-notifications.json`
- `output/top-10-notifications.txt`
- `logs/assessment.log`
