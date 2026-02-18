import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const fmt = (d: Date) => d.toISOString().split("T")[0];

const getWeekDays = (centerDate: string) => {
  const center = new Date(centerDate + "T12:00:00");
  const dayOfWeek = center.getDay(); // 0=Sun
  const monday = new Date(center);
  monday.setDate(center.getDate() - ((dayOfWeek + 6) % 7)); // go to Monday

  const days: { date: string; label: string }[] = [];
  const today = fmt(new Date());
  const tomorrow = fmt(new Date(Date.now() + 86400000));

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = fmt(d);
    let label: string;
    if (dateStr === today) label = "Today";
    else if (dateStr === tomorrow) label = "Tmrw";
    else label = d.toLocaleDateString("en-US", { weekday: "short" });
    days.push({ date: dateStr, label });
  }
  return days;
};

const DateSelector = ({ selectedDate, onSelectDate }: DateSelectorProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onSelectDate(fmt(date));
      setCalendarOpen(false);
    }
  };

  const centerDate = new Date(selectedDate + "T12:00:00");
  const monthLabel = centerDate.toLocaleDateString("en-US", { month: "short" });

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground writing-mode-vertical rotate-180 leading-none">{monthLabel}</span>
      <div className="flex gap-1.5 flex-1 overflow-x-auto scrollbar-hide px-1">
        {weekDays.map((day) => {
          const isActive = day.date === selectedDate;
          const dateObj = new Date(day.date + "T12:00:00");
          const dayNum = dateObj.getDate();

          return (
            <motion.button
              key={day.date}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate(day.date)}
              className={`relative flex flex-col items-center justify-center min-w-[44px] px-2 py-1.5 rounded-2xl transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-foreground hover:bg-secondary"
              }`}
            >
              <span className="text-[10px] font-medium opacity-80">{day.label}</span>
              <span className="text-base font-bold">{dayNum}</span>
              {isActive && (
                <motion.div
                  layoutId="dateIndicator"
                  className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-accent-foreground"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-secondary flex items-center justify-center border border-border/50"
          >
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end" side="top">
          <Calendar
            mode="single"
            selected={new Date(selectedDate + "T12:00:00")}
            onSelect={handleCalendarSelect}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
