"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function parseValue(value: string): { date: Date | undefined; time: string } {
  if (!value) return { date: undefined, time: "00:00" };
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  return { date: new Date(year, month - 1, day), time: timePart ?? "00:00" };
}

function toValue(date: Date, time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(hours)}:${pad(minutes)}`;
}

function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

export function DateTimePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date and time",
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const { date, time } = parseValue(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-64 justify-start text-left font-normal",
            className,
          )}
        >
          <CalendarIcon data-icon="inline-start" />
          {date ? (
            format(combineDateAndTime(date, time), "PPP 'at' p")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(nextDate) => {
            if (!nextDate) {
              onChange("");
              return;
            }
            onChange(toValue(nextDate, time));
          }}
        />
        <div className="flex items-center justify-between gap-2 border-t p-3">
          <Input
            type="time"
            value={time}
            onChange={(event) =>
              onChange(toValue(date ?? new Date(), event.target.value))
            }
            className="w-auto"
          />
          {date ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
