# Stage 1

## Problem Summary

We need to identify the top 10 most important unread notifications from the notification API. Priority is based on:

1. Notification type weight
2. Recency within the same weight class

Weight order:

- Placement = 3
- Result = 2
- Event = 1

## Approach

The implementation fetches notifications from the protected API and normalizes each item into a common internal structure:

- `id`
- `type`
- `message`
- `timestamp`
- `weight`

After normalization, the code maintains the best top 10 notifications using a bounded min-heap.

## Why A Min-Heap

If we sort the entire notification list every time a new item arrives, the cost becomes `O(m log m)` for `m` notifications.

Instead, a min-heap of size 10 keeps only the current best notifications:

- If the heap has fewer than 10 items, insert the notification.
- If the heap is full, compare the new notification with the smallest-ranked item in the heap.
- Replace the smallest item only when the new notification has higher priority.

This makes the streaming maintenance cost:

- `O(log 10)` per insertion, which is effectively constant
- `O(m log 10)` for processing `m` notifications

That is the most suitable structure here because the requirement is only top 10, not full sorting.

## Priority Rules

Notifications are ranked by:

1. Higher weight first
2. More recent timestamp first
3. Notification id as a stable tie-breaker

This guarantees deterministic ordering even when two notifications have the same type and timestamp.

## Logging Strategy

The solution uses a custom file-based logging module instead of console logging. The logger records:

- API fetch start
- API fetch success/failure
- output generation
- overall execution success/failure

Logs are written to:

- `stage-1/logs/assessment.log`

## Output Artifacts

The script generates:

- `stage-1/output/top-10-notifications.json`
- `stage-1/output/top-10-notifications.txt`

These files make it easy to review the ranked data and capture screenshots for submission.

## Assumptions

- The API returns notifications in a `notifications` array.
- Read/unread state is not present in the sample payload, so all fetched notifications are treated as unread for this stage.
- The protected API token is supplied through environment variables at runtime.

## How To Run

Set the required token and run:

```powershell
$env:AUTH_TOKEN="your-token"
node .\stage-1\priority-inbox.js
```

Optional variables:

```powershell
$env:NOTIFICATIONS_API_URL="http://20.207.122.201/evaluation-service/notifications"
$env:TOP_N="10"
$env:AUTH_SCHEME="Bearer"
```
