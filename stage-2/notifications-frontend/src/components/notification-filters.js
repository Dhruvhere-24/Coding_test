"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

export function NotificationFilters({
  type,
  onTypeChange,
  page,
  onPageChange,
  limit,
  onLimitChange,
  showTopN = false,
}) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="type-filter-label">Type</InputLabel>
        <Select
          labelId="type-filter-label"
          value={type}
          label="Type"
          onChange={(event) => onTypeChange(event.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      {showTopN ? (
        <TextField
          fullWidth
          label="Top N"
          type="number"
          value={limit}
          onChange={(event) => onLimitChange(Number(event.target.value) || 10)}
          inputProps={{ min: 1, max: 50 }}
        />
      ) : (
        <>
          <TextField
            fullWidth
            label="Page"
            type="number"
            value={page}
            onChange={(event) => onPageChange(Number(event.target.value) || 1)}
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Per Page"
            type="number"
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value) || 10)}
            inputProps={{ min: 1, max: 50 }}
          />
        </>
      )}
    </Stack>
  );
}
