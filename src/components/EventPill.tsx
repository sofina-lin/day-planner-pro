import { motion } from "framer-motion";
import { ItineraryEvent, getCategoryColor, getCategoryIcon } from "@/data/mockEvents";
import { MapPin, Clock, Sparkles } from "lucide-react";

interface EventPillProps {
  event: ItineraryEvent;
  onClick: () => void;
  index: number;
}

const EventPill = ({ event, onClick, index }: EventPillProps) => {
  const catColor = getCategoryColor(event.category);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full text-left"
    >
      <div className="flex gap-3 p-3 rounded-2xl bg-card pill-shadow border border-border/50 transition-shadow hover:shadow-md">
        {/* Number badge */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl text-sm font-bold"
          style={{ background: catColor, color: "white" }}
        >
          {event.number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground truncate">{event.title}</span>
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
        </div>

        <div className="flex-shrink-0 self-center text-lg">
          {getCategoryIcon(event.category)}
        </div>
      </div>
    </motion.button>
  );
};

export default EventPill;
