"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export function LocalTime({ date, formatStr = "h:mm a" }: { date: Date | string, formatStr?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same visual weight, avoiding hydration mismatch
    return <span className="opacity-0">12:00 PM</span>;
  }

  // Ensure the date string is treated as UTC if it doesn't already specify a timezone
  let dateString = date instanceof Date ? date.toISOString() : String(date);
  
  // If it doesn't have a Z or an offset (+ or - after the time)
  if (!dateString.endsWith('Z') && !dateString.match(/[+-]\d{2}:\d{2}$/)) {
    // Replace space with T to make it ISO 8601 compliant
    if (dateString.includes(' ')) {
      dateString = dateString.replace(' ', 'T');
    }
    // Append Z to force UTC parsing
    if (!dateString.endsWith('Z')) {
      dateString += 'Z';
    }
  }

  return <span>{format(new Date(dateString), formatStr)}</span>;
}
