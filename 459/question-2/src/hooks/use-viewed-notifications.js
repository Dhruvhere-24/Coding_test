"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "campus-notifications-viewed";

export function useViewedNotifications() {
  const [viewedIds, setViewedIds] = useState([]);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(STORAGE_KEY);
      if (rawValue) {
        setViewedIds(JSON.parse(rawValue));
      }
    } catch (_error) {
      setViewedIds([]);
    }
  }, []);

  function markViewed(id) {
    setViewedIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds;
      }

      const nextIds = [...currentIds, id];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
      return nextIds;
    });
  }

  return {
    viewedIds,
    markViewed,
  };
}
