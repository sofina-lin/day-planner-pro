import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ItineraryEvent, getCategoryColor, getCategoryIcon, getTravelIcon, TravelSegment } from "@/data/mockEvents";
import { X, MapPin, Clock, Users, Bell, FileText, Navigation, Sparkles, ChevronRight, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventDetailProps {
  event: ItineraryEvent;
  travelTo?: TravelSegment;
  onClose: () => void;
  onNavigate: () => void;
  onUpdateEvent?: (updated: ItineraryEvent) => void;
}

const EventDetail = ({ event, travelTo, onClose, onNavigate, onUpdateEvent }: EventDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(event.title);
  const [editStartTime, setEditStartTime] = useState(event.startTime);
  const [editEndTime, setEditEndTime] = useState(event.endTime);
  const [editLocation, setEditLocation] = useState(event.location);
  const [editDescription, setEditDescription] = useState(event.description || "");
  const [editNotes, setEditNotes] = useState(event.notes || "");

  const catColor = getCategoryColor(event.category);

  const handleSave = () => {
    if (onUpdateEvent) {
      onUpdateEvent({
        ...event,
        title: editTitle,
        startTime: editStartTime,
        endTime: editEndTime,
        location: editLocation,
        description: editDescription,
        notes: editNotes,
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(event.title);
    setEditStartTime(event.startTime);
    setEditEndTime(event.endTime);
    setEditLocation(event.location);
    setEditDescription(event.description || "");
    setEditNotes(event.notes || "");
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl bg-card overflow-y-auto"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="px-5 pt-2 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-2xl text-base font-bold flex-shrink-0"
                  style={{ background: catColor, color: "white" }}
                >
                  {event.number}
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-xl font-bold text-foreground bg-muted rounded-xl px-3 py-1.5 w-full outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-foreground">{event.title}</h2>
                      {event.type === "ai-generated" && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" /> AI
                        </span>
                      )}
                    </div>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {getCategoryIcon(event.category)} {event.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-muted">
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                ) : (
                  <>
                    <button onClick={handleSave} className="p-2 rounded-full hover:bg-accent/10">
                      <Check className="w-5 h-5 text-accent" />
                    </button>
                    <button onClick={handleCancelEdit} className="p-2 rounded-full hover:bg-muted">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </>
                )}
                {!isEditing && (
                  <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Info rows */}
          <div className="px-5 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="bg-muted rounded-lg px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring w-24"
                  />
                  <span className="text-muted-foreground">–</span>
                  <input
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="bg-muted rounded-lg px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring w-24"
                  />
                </div>
              ) : (
                <span className="text-foreground">
                  {event.startTime} – {event.endTime} <span className="text-muted-foreground">({event.duration})</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {isEditing ? (
                <input
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="flex-1 bg-muted rounded-lg px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <span className="text-foreground">{event.location}</span>
              )}
            </div>

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-start gap-3 text-sm">
                <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {event.attendees.map((a) => (
                    <span key={a} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.reminders && event.reminders.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{event.reminders.join(", ")}</span>
              </div>
            )}

            <div className="flex items-start gap-3 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              {isEditing ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={3}
                  className="flex-1 bg-muted rounded-lg px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              ) : (
                event.description && <p className="text-foreground leading-relaxed">{event.description}</p>
              )}
            </div>

            {isEditing ? (
              <div className="p-3 rounded-xl bg-muted">
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="📝 Add notes..."
                  rows={2}
                  className="w-full bg-transparent text-sm text-muted-foreground outline-none resize-none"
                />
              </div>
            ) : (
              event.notes && (
                <div className="p-3 rounded-xl bg-muted text-sm text-muted-foreground">
                  📝 {event.notes}
                </div>
              )
            )}
          </div>

          {/* Navigate CTA */}
          {!isEditing && (
            <div className="px-5 py-5 mt-4">
              {travelTo && (
                <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                  <span>{getTravelIcon(travelTo.method)}</span>
                  <span>{travelTo.duration} by {travelTo.method}</span>
                  {travelTo.distance && <span>· {travelTo.distance}</span>}
                </div>
              )}
              <Button
                onClick={onNavigate}
                className="w-full h-14 rounded-2xl nav-gradient text-accent-foreground font-semibold text-base gap-2 shadow-lg"
              >
                <Navigation className="w-5 h-5" />
                Go – Start Navigation
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Safe area padding */}
          <div className="h-6" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventDetail;
