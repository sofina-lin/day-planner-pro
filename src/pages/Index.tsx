import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { mockItineraries, ItineraryEvent, DayItinerary } from "@/data/mockEvents";
import MapView from "@/components/MapView";
import DateSelector from "@/components/DateSelector";
import EventPill from "@/components/EventPill";
import TravelIndicator from "@/components/TravelIndicator";
import EventDetail from "@/components/EventDetail";
import NavigationView from "@/components/NavigationView";
import AIChatPanel from "@/components/AIChatPanel";
import LocationSearch from "@/components/LocationSearch";
import AccountMenu from "@/components/AccountMenu";
import { toast } from "sonner";

interface NavigationDestination {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

const Index = () => {
  const [itineraries, setItineraries] = useState<DayItinerary[]>(mockItineraries);
  const [selectedDate, setSelectedDate] = useState(mockItineraries[0].date);
  const [selectedEvent, setSelectedEvent] = useState<ItineraryEvent | null>(null);
  const [navDestination, setNavDestination] = useState<NavigationDestination | null>(null);
  const [navFromEvent, setNavFromEvent] = useState<ItineraryEvent | undefined>(undefined);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const currentDay = useMemo(
    () => itineraries.find((d) => d.date === selectedDate) || itineraries[0],
    [selectedDate, itineraries]
  );

  const selectedEventIndex = selectedEvent
    ? currentDay.events.findIndex((e) => e.id === selectedEvent.id)
    : -1;

  const travelToSelected =
    selectedEventIndex > 0
      ? currentDay.travel[selectedEventIndex - 1]
      : undefined;

  // Navigate from event detail
  const handleNavigateFromEvent = useCallback(() => {
    if (!selectedEvent) return;
    const idx = currentDay.events.findIndex((e) => e.id === selectedEvent.id);
    const from = idx > 0 ? currentDay.events[idx - 1] : undefined;
    setNavFromEvent(from);
    setNavDestination({
      name: selectedEvent.title,
      lat: selectedEvent.lat,
      lng: selectedEvent.lng,
      address: selectedEvent.location,
    });
    setSelectedEvent(null);
  }, [selectedEvent, currentDay]);

  // Navigate from search
  const handleNavigateFromSearch = useCallback(
    (dest: { name: string; address: string; lat: number; lng: number }) => {
      // Use user's "current" location as the last event or fallback
      const lastEvent = currentDay.events.length > 0
        ? currentDay.events[currentDay.events.length - 1]
        : undefined;
      setNavFromEvent(lastEvent);
      setNavDestination({ name: dest.name, lat: dest.lat, lng: dest.lng, address: dest.address });
    },
    [currentDay]
  );

  const handleCloseNavigation = useCallback(() => {
    setNavDestination(null);
    setNavFromEvent(undefined);
  }, []);

  const handleUpdateEvent = useCallback((updated: ItineraryEvent) => {
    setItineraries((prev) =>
      prev.map((day) => ({
        ...day,
        events: day.events.map((e) => (e.id === updated.id ? updated : e)),
      }))
    );
    setSelectedEvent(updated);
    toast.success("Event updated");
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Map layer */}
      <div className="absolute inset-0">
        <MapView
          events={currentDay.events}
          onMarkerClick={(event) => setSelectedEvent(event)}
        />
      </div>

      {/* Location search */}
      <LocationSearch onNavigateTo={handleNavigateFromSearch} />

      {/* Top-right buttons */}
      <div className="absolute top-12 right-4 z-20 flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAccountOpen(true)}
          className="w-12 h-12 rounded-2xl bg-card shadow-lg flex items-center justify-center border border-border/50"
        >
          <User className="w-5 h-5 text-foreground" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-12 h-12 rounded-2xl nav-gradient flex items-center justify-center shadow-lg ${isChatOpen ? "ring-2 ring-accent/50" : ""}`}
        >
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </motion.button>
      </div>

      {/* Bottom Sheet */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 rounded-t-3xl bg-card shadow-2xl"
        initial={{ y: "60%" }}
        animate={{ y: sheetExpanded ? "5%" : "55%" }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.y < -50) setSheetExpanded(true);
          if (info.offset.y > 50) setSheetExpanded(false);
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ height: "95%" }}
      >
        {/* Handle */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
          onClick={() => setSheetExpanded(!sheetExpanded)}
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Date selector */}
        <div className="px-4">
          <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        {/* Title */}
        <div className="px-5 pt-2 pb-1">
          <h2 className="text-lg font-bold text-foreground">Itinerary</h2>
          <p className="text-xs text-muted-foreground">{currentDay.events.length} events</p>
        </div>

        {/* Events list */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 space-y-1">
          {currentDay.events.map((event, i) => (
            <div key={event.id}>
              <EventPill
                event={event}
                index={i}
                onClick={() => setSelectedEvent(event)}
              />
              {i < currentDay.events.length - 1 && currentDay.travel[i] && (
                <TravelIndicator segment={currentDay.travel[i]} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && !navDestination && (
          <EventDetail
            event={selectedEvent}
            travelTo={travelToSelected}
            onClose={() => setSelectedEvent(null)}
            onNavigate={handleNavigateFromEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}
      </AnimatePresence>

      {/* Navigation View */}
      <AnimatePresence>
        {navDestination && (
          <NavigationView
            destination={navDestination}
            fromEvent={navFromEvent}
            travel={travelToSelected}
            onClose={handleCloseNavigation}
          />
        )}
      </AnimatePresence>

      {/* AI Chat */}
      <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Account Menu */}
      <AccountMenu isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </div>
  );
};

export default Index;
