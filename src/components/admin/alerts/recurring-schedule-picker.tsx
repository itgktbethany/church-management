"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = [
  { label: "Sunday",    value: "0" },
  { label: "Monday",   value: "1" },
  { label: "Tuesday",  value: "2" },
  { label: "Wednesday",value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday",   value: "5" },
  { label: "Saturday", value: "6" },
];

type RepeatPattern = "daily" | "weekly" | "monthly";

interface RecurringSchedulePickerProps {
  /** Called whenever the user changes any field; passes the resulting cron expression */
  onChange: (cron: string) => void;
  defaultCron?: string;
}

/** Parse a simple cron back into UI state so the Edit dialog can restore values */
function parseCron(cron: string): {
  time: string;
  pattern: RepeatPattern;
  dayOfWeek: string;
  dayOfMonth: string;
} {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { time: "09:00", pattern: "daily", dayOfWeek: "1", dayOfMonth: "1" };
  }
  const [minute, hour, dom, , dow] = parts;
  const time = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;

  if (dom !== "*") {
    return { time, pattern: "monthly", dayOfWeek: "1", dayOfMonth: dom };
  }
  if (dow !== "*") {
    return { time, pattern: "weekly", dayOfWeek: dow, dayOfMonth: "1" };
  }
  return { time, pattern: "daily", dayOfWeek: "1", dayOfMonth: "1" };
}

function buildCron(
  time: string,
  pattern: RepeatPattern,
  dayOfWeek: string,
  dayOfMonth: string
): string {
  const [h, m] = time.split(":").map(Number);
  const hour   = isNaN(h) ? 9  : h;
  const minute = isNaN(m) ? 0  : m;
  switch (pattern) {
    case "daily":   return `${minute} ${hour} * * *`;
    case "weekly":  return `${minute} ${hour} * * ${dayOfWeek}`;
    case "monthly": return `${minute} ${hour} ${dayOfMonth} * *`;
  }
}

export function RecurringSchedulePicker({
  onChange,
  defaultCron,
}: RecurringSchedulePickerProps) {
  const parsed = defaultCron ? parseCron(defaultCron) : null;

  const [time,       setTime]       = useState(parsed?.time       ?? "09:00");
  const [pattern,    setPattern]    = useState<RepeatPattern>(parsed?.pattern    ?? "daily");
  const [dayOfWeek,  setDayOfWeek]  = useState(parsed?.dayOfWeek  ?? "1");
  const [dayOfMonth, setDayOfMonth] = useState(parsed?.dayOfMonth ?? "1");

  function emit(
    t: string    = time,
    p: RepeatPattern = pattern,
    dow: string  = dayOfWeek,
    dom: string  = dayOfMonth
  ) {
    onChange(buildCron(t, p, dow, dom));
  }

  function handleTime(v: string) {
    setTime(v);
    emit(v);
  }
  function handlePattern(v: RepeatPattern) {
    setPattern(v);
    emit(time, v);
  }
  function handleDow(v: string) {
    setDayOfWeek(v);
    emit(time, pattern, v);
  }
  function handleDom(v: string) {
    setDayOfMonth(v);
    emit(time, pattern, dayOfWeek, v);
  }

  const humanLabel = (() => {
    const cron = buildCron(time, pattern, dayOfWeek, dayOfMonth);
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const displayM = String(m ?? 0).padStart(2, "0");
    const timeStr = `${displayH}:${displayM} ${ampm}`;

    switch (pattern) {
      case "daily":
        return `Every day at ${timeStr}`;
      case "weekly": {
        const day = DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label ?? "Monday";
        return `Every ${day} at ${timeStr}`;
      }
      case "monthly": {
        const suffix = ["th","st","nd","rd"][Number(dayOfMonth) <= 3 ? Number(dayOfMonth) : 0] ?? "th";
        return `On the ${dayOfMonth}${suffix} of every month at ${timeStr}`;
      }
    }
    return cron;
  })();

  return (
    <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
      {/* Time picker */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Send at time</Label>
        <Input
          type="time"
          value={time}
          onChange={(e) => handleTime(e.target.value)}
          className="w-36"
        />
      </div>

      {/* Repeat pattern */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">Repeat</Label>
        <Select value={pattern} onValueChange={(v) => handlePattern(v as RepeatPattern)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Every day</SelectItem>
            <SelectItem value="weekly">Every week</SelectItem>
            <SelectItem value="monthly">Every month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Day-of-week picker (weekly) */}
      {pattern === "weekly" && (
        <div className="space-y-1">
          <Label className="text-sm font-medium">On which day?</Label>
          <div className="flex flex-wrap gap-1.5">
            {DAYS_OF_WEEK.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => handleDow(d.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  dayOfWeek === d.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                )}
              >
                {d.label.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Day-of-month picker (monthly) */}
      {pattern === "monthly" && (
        <div className="space-y-1">
          <Label className="text-sm font-medium">On day of month</Label>
          <Input
            type="number"
            min={1}
            max={28}
            value={dayOfMonth}
            onChange={(e) => handleDom(e.target.value)}
            className="w-24"
          />
          <p className="text-xs text-muted-foreground">1 – 28</p>
        </div>
      )}

      {/* Live preview */}
      <p className="rounded-lg bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
        🔔 {humanLabel}
      </p>
    </div>
  );
}
