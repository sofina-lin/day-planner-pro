import { motion } from "framer-motion";
import { mockItineraries } from "@/data/mockEvents";

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DateSelector = ({ selectedDate, onSelectDate }: DateSelectorProps) => {
  return (
    <div className="flex gap-2 px-1 py-2 overflow-x-auto scrollbar-hide">
      {mockItineraries.map((day) => {
        const isActive = day.date === selectedDate;
        const dateObj = new Date(day.date + "T12:00:00");
        const dayName = day.label === "Today" || day.label === "Tomorrow"
          ? day.label
          : dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const dayNum = dateObj.getDate();

        return (
          <motion.button
            key={day.date}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectDate(day.date)}
            className={`relative flex flex-col items-center justify-center min-w-[60px] px-3 py-2 rounded-2xl transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "bg-card text-foreground hover:bg-secondary"
            }`}
          >
            <span className="text-[11px] font-medium opacity-80">{dayName}</span>
            <span className="text-lg font-bold">{dayNum}</span>
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
  );
};

export default DateSelector;
