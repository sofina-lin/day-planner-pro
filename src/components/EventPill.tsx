import { motion } from "framer-motion";
import { ItineraryEvent, getCategoryColor, getCategoryIcon } from "@/data/mockEvents";
import { MapPin, Clock, Sparkles, Check } from "lucide-react";

interface EventPillProps {
  event: ItineraryEvent;
  onClick: () => void;
  index: number;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
}

const EventPill = ({ event, onClick, index, isCompleted, onToggleComplete }: EventPillProps) => {
  const catColor = getCategoryColor(event.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="relative w-full"
    >
      <div className={`flex gap-3 p-3 rounded-2xl bg-card pill-shadow border border-border/50 transition-all hover:shadow-md ${isCompleted ? "opacity-60" : ""}`}>
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(event.id);
          }}
          className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg border-2 self-center transition-colors ${
            isCompleted
              ? "bg-accent border-accent"
              : "border-muted-foreground/30 hover:border-accent"
          }`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 text-accent-foreground" />}
        </button>

        {/* Number badge */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl text-sm font-bold"
          style={{ background: catColor, color: "white" }}
        >
          {event.number}
        </div>

        <button onClick={onClick} className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold text-foreground truncate ${isCompleted ? "line-through" : ""}`}>{event.title}</span>
            {event.type === "ai-generated" && (
              <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {event.startTime} · {event.duration}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </button>

        <div className="flex-shrink-0 self-center text-lg">
          {getCategoryIcon(event.category)}
        </div>
      </div>
    </motion.div>
  );
};

export default EventPill;
