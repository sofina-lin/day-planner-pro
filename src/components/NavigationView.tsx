import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ItineraryEvent, TravelSegment, getTravelIcon } from "@/data/mockEvents";
import { X, Volume2, ChevronUp, Car, Footprints } from "lucide-react";

type TransportMode = "walking" | "car";

interface NavigationDestination {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

interface NavigationViewProps {
  destination: NavigationDestination;
  fromEvent?: ItineraryEvent;
  travel?: TravelSegment;
  onClose: () => void;
}

const TRANSPORT_ESTIMATES: Record<TransportMode, { speed: number; label: string }> = {
  walking: { speed: 4.5, label: "Walking" },
  car: { speed: 35, label: "Driving" },
};

const NavigationView = ({ destination, fromEvent, travel, onClose }: NavigationViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [mode, setMode] = useState<TransportMode>(travel?.method === "car" ? "car" : "walking");

  const from: [number, number] = fromEvent
    ? [fromEvent.lat, fromEvent.lng]
    : [destination.lat + 0.005, destination.lng + 0.003];
  const to: [number, number] = [destination.lat, destination.lng];

  // Rough distance in miles
  const distMiles = (() => {
    const R = 3958.8;
    const dLat = ((to[0] - from[0]) * Math.PI) / 180;
    const dLng = ((to[1] - from[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((from[0] * Math.PI) / 180) *
        Math.cos((to[0] * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  })();

  const etaMinutes = Math.max(1, Math.round((distMiles / TRANSPORT_ESTIMATES[mode].speed) * 60));
  const durationLabel = etaMinutes < 60 ? `${etaMinutes} min` : `${Math.floor(etaMinutes / 60)} hr ${etaMinutes % 60} min`;
  const distLabel = distMiles < 0.1 ? `${Math.round(distMiles * 5280)} ft` : `${distMiles.toFixed(1)} mi`;

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: to,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png").addTo(map);

    const routeColor = mode === "car" ? "hsl(220, 60%, 50%)" : "hsl(12, 80%, 58%)";

    // Current position pin
    const navIcon = L.divIcon({
      className: "",
      html: `<div style="width:20px;height:20px;background:${routeColor};border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
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
      color: routeColor,
      weight: 5,
      dashArray: mode === "walking" ? "12, 8" : undefined,
    }).addTo(map);

    map.fitBounds([from, to], { padding: [60, 60] });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mode, destination.lat, destination.lng]);

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
          <div className="text-center flex-1 mx-3">
            <p className="text-xs text-muted-foreground font-medium">NAVIGATING TO</p>
            <p className="text-sm font-bold text-foreground truncate">{destination.name}</p>
          </div>
          <button className="p-2 rounded-full bg-card/80">
            <Volume2 className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Transport mode toggle */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <button
            onClick={() => setMode("walking")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              mode === "walking"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Footprints className="w-4 h-4" />
            Walking
          </button>
          <button
            onClick={() => setMode("car")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              mode === "car"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Car className="w-4 h-4" />
            Driving
          </button>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="glass-panel rounded-t-3xl px-5 pt-4 pb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-foreground">{durationLabel}</p>
              <p className="text-sm text-muted-foreground">
                {distLabel} · {mode === "car" ? "🚗" : "🚶"} {TRANSPORT_ESTIMATES[mode].label}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">ETA</span>
              <p className="text-sm font-semibold text-foreground">
                {new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary text-primary-foreground">
            <ChevronUp className="w-6 h-6" />
            <div>
              <p className="text-sm font-semibold">
                {mode === "car" ? "Head north on 5th Avenue" : "Continue on 5th Avenue"}
              </p>
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
