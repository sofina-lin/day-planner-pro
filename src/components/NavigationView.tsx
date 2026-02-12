import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ItineraryEvent, TravelSegment, getTravelIcon } from "@/data/mockEvents";
import { X, Volume2, ChevronUp } from "lucide-react";

interface NavigationViewProps {
  event: ItineraryEvent;
  fromEvent?: ItineraryEvent;
  travel?: TravelSegment;
  onClose: () => void;
}

const NavigationView = ({ event, fromEvent, travel, onClose }: NavigationViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const from: [number, number] = fromEvent
    ? [fromEvent.lat, fromEvent.lng]
    : [event.lat + 0.005, event.lng + 0.003];
  const to: [number, number] = [event.lat, event.lng];

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: to,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png").addTo(map);

    // Current position pin
    const navIcon = L.divIcon({
      className: "",
      html: `<div style="width:20px;height:20px;background:hsl(12,80%,58%);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Destination pin
    const destIcon = L.divIcon({
      className: "",
      html: `<div style="width:28px;height:28px;background:hsl(220,60%,22%);border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);color:white;font-weight:700;font-size:12px">📍</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    });

    L.marker(from, { icon: navIcon }).addTo(map);
    L.marker(to, { icon: destIcon }).addTo(map);

    const midpoint: [number, number] = [
      (from[0] + to[0]) / 2 + 0.002,
      (from[1] + to[1]) / 2 - 0.003,
    ];
    L.polyline([from, midpoint, to], {
      color: "hsl(12, 80%, 58%)",
      weight: 5,
      dashArray: "12, 8",
    }).addTo(map);

    map.fitBounds([from, to], { padding: [60, 60] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background"
    >
      {/* Map */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 glass-panel">
        <div className="flex items-center justify-between px-4 pt-12 pb-3">
          <button onClick={onClose} className="p-2 rounded-full bg-card/80">
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium">NAVIGATING TO</p>
            <p className="text-sm font-bold text-foreground">{event.title}</p>
          </div>
          <button className="p-2 rounded-full bg-card/80">
            <Volume2 className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="glass-panel rounded-t-3xl px-5 pt-4 pb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {travel?.duration || "10 min"}
              </p>
              <p className="text-sm text-muted-foreground">
                {travel?.distance || "0.8 mi"} · {travel ? getTravelIcon(travel.method) : "🚶"}{" "}
                {travel?.method || "walking"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">ETA</span>
              <span className="text-sm font-semibold text-foreground">{event.startTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary text-primary-foreground">
            <ChevronUp className="w-6 h-6" />
            <div>
              <p className="text-sm font-semibold">Continue on 5th Avenue</p>
              <p className="text-xs opacity-80">Then turn right on 42nd St</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-3 py-3 rounded-2xl bg-destructive text-destructive-foreground font-semibold text-sm"
          >
            End Navigation
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NavigationView;
