import { useEffect, useRef } from "react";
import L from "leaflet";
import { ItineraryEvent } from "@/data/mockEvents";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  events: ItineraryEvent[];
  onMarkerClick: (event: ItineraryEvent) => void;
}

const createNumberedPin = (num: number) =>
  L.divIcon({
    className: "",
    html: `<div class="custom-pin"><span>${num}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

const MapView = ({ events, onMarkerClick }: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [40.758, -73.9855],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png").addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when events change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (events.length === 0) return;

    events.forEach((event) => {
      const marker = L.marker([event.lat, event.lng], {
        icon: createNumberedPin(event.number),
      })
        .addTo(map)
        .on("click", () => onMarkerClick(event));
      markersRef.current.push(marker);
    });

    const bounds = L.latLngBounds(events.map((e) => [e.lat, e.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [events, onMarkerClick]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default MapView;
