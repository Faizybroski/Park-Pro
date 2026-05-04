"use client";

import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

function TimeColumn({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = items.indexOf(selected);
    if (idx !== -1 && containerRef.current) {
      const item = containerRef.current.children[idx] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [selected, items]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col overflow-y-auto h-56 w-14 scrollbar-thin"
    >
      {items.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onSelect(v)}
          className={`text-sm py-1.5 rounded-md text-center shrink-0 hover:bg-muted ${
            selected === v
              ? "bg-primary text-white hover:bg-primary font-medium"
              : ""
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export function DateTimePicker({ value, onChange }: Props) {
  const parsed = value ? new Date(value) : undefined;

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(parsed);
  const [hour, setHour] = useState(
    parsed ? parsed.getHours().toString().padStart(2, "0") : "00",
  );
  const [minute, setMinute] = useState(
    parsed ? parsed.getMinutes().toString().padStart(2, "0") : "00",
  );

  const commit = (d: Date | undefined, h: string, m: string) => {
    if (!d) return;
    const finalDate = new Date(d);
    finalDate.setHours(Number(h));
    finalDate.setMinutes(Number(m));
    finalDate.setSeconds(0);
    finalDate.setMilliseconds(0);
    onChange(finalDate.toISOString());
  };

  const handleHourSelect = (h: string) => {
    setHour(h);
    commit(date, h, minute);
  };

  const handleMinuteSelect = (m: string) => {
    setMinute(m);
    commit(date, hour, m);
    if (date) setOpen(false);
  };

  const handleDateSelect = (d: Date | undefined) => {
    setDate(d);
    commit(d, hour, minute);
  };

  const displayTime = `${hour}:${minute}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="active:bg-primary">
        <Button
          variant="outline"
          className="w-full h-11 rounded-full justify-start text-left font-normal border border-primary-light/10 bg-input hover:bg-input active:bg-input data-[state=open]:bg-input data-[state=open]:border-primary data-[state=open]:ring-3 data-[state=open]:ring-primary/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/50"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {date ? (
            <>
              <span className="text-primary">{format(date, "PPP")}</span>
              <span className="mx-2 text-primary">•</span>
              <Clock className="mr-1 h-4 w-4 text-primary" />
              <span className="text-primary">{displayTime}</span>
            </>
          ) : (
            <span className="text-primary/80">Pick date & time</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0 rounded-xl shadow-lg w-auto">
        <div className="flex">
          {/* Calendar */}
          <div className="border-r p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={{ before: new Date() }}
              initialFocus
            />
          </div>

          {/* Time picker: hours + minutes columns */}
          <div className="p-3 flex flex-col gap-2">
            <p className="text-sm text-primary-light font-medium">
              Select time
            </p>
            <div className="flex gap-1">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">HH</span>
                <TimeColumn
                  items={HOURS}
                  selected={hour}
                  onSelect={handleHourSelect}
                />
              </div>
              <div className="flex items-center justify-center pt-5 text-primary font-semibold">
                :
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">MM</span>
                <TimeColumn
                  items={MINUTES}
                  selected={minute}
                  onSelect={handleMinuteSelect}
                />
              </div>
            </div>
            <p className="text-center text-sm font-medium text-primary">
              {displayTime}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
